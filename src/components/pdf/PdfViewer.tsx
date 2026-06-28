'use client'
import { useState } from 'react'

type Props = {
  url: string
  manualTitle: string
}

export default function PdfViewer({ url, manualTitle }: Props) {
  const [translating, setTranslating] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [translation, setTranslation] = useState('')
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

  async function handleTranslate() {
    if (!selectedText) return
    setTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText, targetLang: 'KO' }),
      })
      const data = await res.json()
      setTranslation(data.translated || data.error)
    } finally {
      setTranslating(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* PDF iframe */}
      <div className="flex-1 military-card overflow-hidden relative flex flex-col" style={{ height: '60vh', minHeight: '400px' }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
          <span className="text-slate-400 text-xs">Google Docs Viewer</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs hover:text-blue-300"
          >
            원본 PDF 열기 ↗
          </a>
        </div>
        <iframe
          src={viewerUrl}
          className="w-full flex-1"
          title={manualTitle}
        />
        <div className="px-4 py-2 bg-slate-900/80 text-xs text-slate-500">
          텍스트를 복사한 후 아래(모바일) 또는 오른쪽(PC) 번역 패널에 붙여넣으세요
        </div>
      </div>

      {/* 번역 패널 */}
      <div className="lg:w-80 flex flex-col gap-3">
        <div className="military-card p-4 flex flex-col gap-3">
          <h3 className="text-blue-300 text-xs font-semibold tracking-widest">번역 패널</h3>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">선택한 영어 텍스트</label>
            <textarea
              className="military-input resize-none text-sm"
              rows={6}
              placeholder="PDF에서 번역할 영어 텍스트를 붙여넣으세요"
              value={selectedText}
              onChange={e => setSelectedText(e.target.value)}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={!selectedText || translating}
            className="military-btn-primary w-full py-2 text-sm disabled:opacity-50"
          >
            {translating ? '번역 중...' : '한국어로 번역'}
          </button>

          {translation && (
            <div>
              <label className="text-slate-400 text-xs mb-1 block">번역 결과</label>
              <div
                className="military-input text-sm leading-relaxed"
                style={{ minHeight: '120px', padding: '12px', whiteSpace: 'pre-wrap' }}
              >
                {translation}
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
