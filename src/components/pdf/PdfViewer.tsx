'use client'
import { useEffect, useState } from 'react'
import PdfJsViewer from './PdfJsViewer'

type Props = {
  url: string
  manualTitle: string
}

type Paragraph = {
  text: string
  translation: string
  translating: boolean
}

export default function PdfViewer({ url, manualTitle }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [rawText, setRawText] = useState('')
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent))
  }, [])

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData('text')
    const paras = text
      .split(/\n{2,}|\r\n{2,}/)
      .map(p => p.replace(/\n/g, ' ').trim())
      .filter(p => p.length > 0)
      .map(p => ({ text: p, translation: '', translating: false }))
    if (paras.length > 0) {
      e.preventDefault()
      setParagraphs(paras)
      setRawText('')
    }
  }

  async function translateParagraph(idx: number) {
    setParagraphs(prev => prev.map((p, i) => i === idx ? { ...p, translating: true } : p))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paragraphs[idx].text, targetLang: 'KO' }),
      })
      const data = await res.json()
      setParagraphs(prev => prev.map((p, i) => i === idx ? { ...p, translation: data.translated || data.error, translating: false } : p))
    } catch {
      setParagraphs(prev => prev.map((p, i) => i === idx ? { ...p, translating: false } : p))
    }
  }

  async function translateAll() {
    for (let i = 0; i < paragraphs.length; i++) {
      if (!paragraphs[i].translation) await translateParagraph(i)
    }
  }

  function reset() {
    setParagraphs([])
    setRawText('')
  }

  // ── 모바일: 브라우저 내장 PDF 뷰어 ──────────────────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <div className="military-card overflow-hidden" style={{ height: '85vh' }}>
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={manualTitle}
          />
        </div>
        <p className="text-slate-500 text-xs text-center px-4">
          텍스트 선택 후 복사 → 아래 번역 패널에 붙여넣기
        </p>
        {/* 모바일 번역 패널 */}
        <TranslationPanel
          rawText={rawText}
          setRawText={setRawText}
          paragraphs={paragraphs}
          setParagraphs={setParagraphs}
          onPaste={handlePaste}
          onTranslate={translateParagraph}
          onTranslateAll={translateAll}
          onReset={reset}
        />
      </div>
    )
  }

  // ── 데스크톱: PDF.js 뷰어 + 번역 패널 ───────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 military-card overflow-hidden flex flex-col" style={{ height: '80vh', minHeight: '500px' }}>
        <div className="px-3 py-2 border-b border-slate-700 flex-shrink-0">
          <span className="text-slate-400 text-xs">텍스트를 드래그하여 선택 후 복사 → 번역 패널에 붙여넣기</span>
        </div>
        <PdfJsViewer url={url} />
      </div>
      <div className="lg:w-96 flex flex-col gap-3">
        <TranslationPanel
          rawText={rawText}
          setRawText={setRawText}
          paragraphs={paragraphs}
          setParagraphs={setParagraphs}
          onPaste={handlePaste}
          onTranslate={translateParagraph}
          onTranslateAll={translateAll}
          onReset={reset}
        />
      </div>
    </div>
  )
}

// ── 번역 패널 컴포넌트 ────────────────────────────────────────────
type PanelProps = {
  rawText: string
  setRawText: (v: string) => void
  paragraphs: Paragraph[]
  setParagraphs: (v: Paragraph[]) => void
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void
  onTranslate: (idx: number) => void
  onTranslateAll: () => void
  onReset: () => void
}

function TranslationPanel({ rawText, setRawText, paragraphs, setParagraphs, onPaste, onTranslate, onTranslateAll, onReset }: PanelProps) {
  return (
    <div className="military-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-blue-300 text-xs font-semibold tracking-widest">번역 패널</h3>
        {paragraphs.length > 0 && (
          <button onClick={onReset} className="text-slate-500 text-xs hover:text-slate-300">초기화</button>
        )}
      </div>

      {paragraphs.length === 0 ? (
        <div>
          <label className="text-slate-400 text-xs mb-1 block">PDF 텍스트 붙여넣기</label>
          <textarea
            className="military-input resize-none text-sm"
            rows={6}
            placeholder="PDF에서 복사한 텍스트를 여기에 붙여넣으세요.&#10;문단이 자동으로 분리됩니다."
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            onPaste={onPaste}
          />
          {rawText && (
            <button
              onClick={() => {
                const paras = rawText.split(/\n{2,}/).map(p => p.replace(/\n/g, ' ').trim()).filter(Boolean).map(p => ({ text: p, translation: '', translating: false }))
                setParagraphs(paras.length > 0 ? paras : [{ text: rawText.trim(), translation: '', translating: false }])
                setRawText('')
              }}
              className="military-btn-primary w-full py-2 text-sm mt-2"
            >
              문단 분리하기
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs">{paragraphs.length}개 문단</span>
            <button onClick={onTranslateAll} className="military-btn text-xs px-3 py-1">전체 번역</button>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {paragraphs.map((para, idx) => (
              <div key={idx} className="rounded border border-slate-700 overflow-hidden">
                <div className="px-3 py-2 bg-slate-800/50 text-xs text-slate-300 leading-relaxed">
                  {para.text}
                </div>
                {para.translation ? (
                  <div className="px-3 py-2 text-xs text-blue-200 leading-relaxed border-t border-slate-700">
                    {para.translation}
                  </div>
                ) : (
                  <button
                    onClick={() => onTranslate(idx)}
                    disabled={para.translating}
                    className="w-full px-3 py-2 text-xs text-slate-500 hover:text-blue-300 hover:bg-slate-800 transition-colors border-t border-slate-700 text-left disabled:opacity-50"
                  >
                    {para.translating ? '번역 중...' : '▶ 번역하기'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
