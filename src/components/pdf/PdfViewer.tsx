'use client'
import { useState } from 'react'

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
  const [rawText, setRawText] = useState('')
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
  const [scrollLocked, setScrollLocked] = useState(false)
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

  function toggleScrollLock() {
    const next = !scrollLocked
    setScrollLocked(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  // 붙여넣으면 문단으로 분리
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

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* PDF iframe */}
      <div className="flex-1 military-card overflow-hidden relative flex flex-col" style={{ height: '60vh', minHeight: '400px' }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
          <span className="text-slate-400 text-xs">Google Docs Viewer</span>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleScrollLock}
              className={`text-xs px-3 py-1 rounded border transition-colors ${
                scrollLocked
                  ? 'bg-yellow-600 border-yellow-500 text-white'
                  : 'border-slate-600 text-slate-400 hover:text-yellow-300 hover:border-yellow-600'
              }`}
            >
              {scrollLocked ? '🔒 잠금 해제' : '🔓 스크롤 잠금'}
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:text-blue-300">
              원본 PDF ↗
            </a>
          </div>
        </div>
        <iframe
          src={viewerUrl}
          className="w-full flex-1"
          title={manualTitle}
          style={{ touchAction: scrollLocked ? 'auto' : undefined }}
        />
        <div className={`px-4 py-2 text-xs ${scrollLocked ? 'bg-yellow-900/40 text-yellow-400' : 'bg-slate-900/80 text-slate-500'}`}>
          {scrollLocked
            ? '🔒 스크롤 잠금 중 — PDF에서 자유롭게 텍스트를 선택하세요'
            : 'PDF 텍스트 선택 시 상단 [스크롤 잠금] 버튼을 먼저 누르세요'}
        </div>
      </div>

      {/* 번역 패널 */}
      <div className="lg:w-96 flex flex-col gap-3">
        <div className="military-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-blue-300 text-xs font-semibold tracking-widest">번역 패널</h3>
            {paragraphs.length > 0 && (
              <button onClick={reset} className="text-slate-500 text-xs hover:text-slate-300">초기화</button>
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
                >
                  문단 분리하기
                </button>
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
                    {/* 원문 */}
                    <div className="px-3 py-2 bg-slate-800/50 text-xs text-slate-300 leading-relaxed">
                      {para.text}
                    </div>
                    {/* 번역 결과 */}
                    {para.translation ? (
                      <div className="px-3 py-2 text-xs text-blue-200 leading-relaxed border-t border-slate-700">
                        {para.translation}
                      </div>
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

        {/* 용어 빠른 검색 */}
        <QuickTermSearch />
      </div>
    </div>
  )
}

function QuickTermSearch() {
  const [term, setTerm] = useState('')
  const [result, setResult] = useState<{ korean: string; english: string; abbreviation?: string; definition_ko?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function search() {
    if (!term) return
    setLoading(true)
    try {
      const res = await fetch(`/api/terms?q=${encodeURIComponent(term)}`)
      const data = await res.json()
      setResult(data.terms?.[0] || null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="military-card p-4">
      <h3 className="text-blue-300 text-xs font-semibold tracking-widest mb-3">용어 빠른 검색</h3>
      <div className="flex gap-2">
        <input
          className="military-input text-sm flex-1"
          placeholder="한국어 용어"
          value={term}
          onChange={e => setTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button onClick={search} className="military-btn text-sm px-3">검색</button>
      </div>
      {loading && <div className="text-slate-400 text-xs mt-2">검색 중...</div>}
      {result && (
        <div className="mt-3 text-sm">
          <div className="text-white font-medium">{result.korean}</div>
          <div className="text-blue-300">{result.english} {result.abbreviation && <span className="text-slate-400">({result.abbreviation})</span>}</div>
          {result.definition_ko && <div className="text-slate-400 text-xs mt-1">{result.definition_ko}</div>}
        </div>
      )}
      {!loading && result === null && term && (
        <div className="text-slate-500 text-xs mt-2">검색 결과 없음</div>
      )}
    </div>
  )
}
