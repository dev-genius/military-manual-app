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
      {/* Google Docs Viewer */}
      <div className="flex-1 military-card overflow-hidden flex flex-col" style={{ height: '75vh', minHeight: '500px' }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 flex-shrink-0">
          <span className="text-slate-400 text-xs">PDF 미리보기</span>
        </div>
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          className="w-full flex-1"
          title={manualTitle}
        />
        <div className="px-3 py-3 border-t border-slate-700 bg-slate-900 flex flex-col gap-2">
          <p className="text-yellow-400 text-xs font-semibold">📋 텍스트 복사 방법</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            뷰어 안에서 복사한 내용은 클립보드에 저장되지 않습니다.<br />
            아래 버튼으로 원본 PDF를 열어 복사 후 번역 패널에 붙여넣으세요.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="military-btn-primary text-center py-2.5 text-sm rounded font-semibold"
          >
            📄 원본 PDF 열기 → 복사하기
          </a>
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
