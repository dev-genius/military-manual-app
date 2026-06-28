'use client'
import { useEffect, useRef, useState } from 'react'
import PdfJsViewer, { PdfJsViewerHandle } from './PdfJsViewer'

type Props = { url: string; manualTitle: string; initialPage?: number }
type Paragraph = { text: string; translation: string; translating: boolean }

export default function PdfViewer({ url, manualTitle, initialPage = 1 }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [rawText, setRawText] = useState('')
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
  const [pageTranslation, setPageTranslation] = useState('')
  const [translatingPage, setTranslatingPage] = useState(false)
  const viewerRef = useRef<PdfJsViewerHandle>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent))
  }, [])

  async function translateCurrentPage() {
    if (!viewerRef.current) return
    setTranslatingPage(true)
    setPageTranslation('')
    try {
      const text = await viewerRef.current.getPageText()
      if (!text) { setTranslatingPage(false); return }
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'KO' }),
      })
      const data = await res.json()
      setPageTranslation(data.translated || data.error || '번역 실패')
    } catch {
      setPageTranslation('번역 중 오류가 발생했습니다.')
    }
    setTranslatingPage(false)
  }

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

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* PDF 뷰어 */}
      <div className="flex-1 military-card overflow-hidden flex flex-col" style={{ height: '80vh', minHeight: '500px' }}>
        {!isMobile && (
          <div className="px-3 py-2 border-b border-slate-700 flex-shrink-0">
            <span className="text-slate-400 text-xs">텍스트를 드래그하여 선택 후 복사 → 번역 패널에 붙여넣기</span>
          </div>
        )}
        <PdfJsViewer ref={viewerRef} url={url} initialPage={initialPage} />
      </div>

      {/* 우측 패널 */}
      <div className="lg:w-96 flex flex-col gap-3">

        {/* 모바일 전용: 현재 페이지 번역 */}
        {isMobile && (
          <div className="military-card p-4 flex flex-col gap-3">
            <h3 className="text-blue-300 text-xs font-semibold tracking-widest">현재 페이지 번역</h3>
            <button
              onClick={translateCurrentPage}
              disabled={translatingPage}
              className="military-btn-primary py-3 text-sm disabled:opacity-50"
            >
              {translatingPage ? '번역 중…' : '현재 페이지 한국어로 번역'}
            </button>
            {pageTranslation && (
              <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto border border-slate-700 rounded p-3 bg-slate-800/50">
                {pageTranslation}
              </div>
            )}
            <p className="text-slate-600 text-xs">* 표·도식은 레이아웃이 깨질 수 있습니다</p>
          </div>
        )}

        {/* 데스크톱 전용: 텍스트 붙여넣기 번역 */}
        {!isMobile && (
          <div className="military-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-300 text-xs font-semibold tracking-widest">번역 패널</h3>
              {paragraphs.length > 0 && (
                <button onClick={() => { setParagraphs([]); setRawText('') }} className="text-slate-500 text-xs hover:text-slate-300">초기화</button>
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
                  onPaste={handlePaste}
                />
                {rawText && (
                  <button
                    onClick={() => {
                      const paras = rawText.split(/\n{2,}/).map(p => p.replace(/\n/g, ' ').trim()).filter(Boolean).map(p => ({ text: p, translation: '', translating: false }))
                      setParagraphs(paras.length > 0 ? paras : [{ text: rawText.trim(), translation: '', translating: false }])
                      setRawText('')
                    }}
                    className="military-btn-primary w-full py-2 text-sm mt-2"
                  >문단 분리하기</button>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs">{paragraphs.length}개 문단</span>
                  <button onClick={translateAll} className="military-btn text-xs px-3 py-1">전체 번역</button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {paragraphs.map((para, idx) => (
                    <div key={idx} className="rounded border border-slate-700 overflow-hidden">
                      <div className="px-3 py-2 bg-slate-800/50 text-xs text-slate-300 leading-relaxed">{para.text}</div>
                      {para.translation ? (
                        <div className="px-3 py-2 text-xs text-blue-200 leading-relaxed border-t border-slate-700">{para.translation}</div>
                      ) : (
                        <button
                          onClick={() => translateParagraph(idx)}
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
        )}
      </div>
    </div>
  )
}
