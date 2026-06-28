'use client'
import { useRef, useState } from 'react'
import PdfJsViewer, { PdfJsViewerHandle } from './PdfJsViewer'

type Props = { url: string; initialPage?: number }

export default function PdfTranslateViewer({ url, initialPage = 1 }: Props) {
  const viewerRef = useRef<PdfJsViewerHandle>(null)
  const [pageTranslation, setPageTranslation] = useState('')
  const [translating, setTranslating] = useState(false)

  async function translateCurrentPage() {
    if (!viewerRef.current) return
    setTranslating(true)
    setPageTranslation('')
    try {
      const text = await viewerRef.current.getPageText()
      if (!text) { setTranslating(false); return }
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
    setTranslating(false)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* PDF 뷰어 */}
      <div className="flex-1 military-card overflow-hidden flex flex-col" style={{ height: '85vh', minHeight: '500px' }}>
        <PdfJsViewer ref={viewerRef} url={url} initialPage={initialPage} />
      </div>

      {/* 번역 패널 */}
      <div className="lg:w-96 flex flex-col gap-3">
        <div className="military-card p-4 flex flex-col gap-3">
          <h3 className="text-purple-300 text-xs font-semibold tracking-widest">현 페이지 번역</h3>
          <button
            onClick={translateCurrentPage}
            disabled={translating}
            className="py-3 text-sm rounded font-semibold transition-colors disabled:opacity-50
              bg-purple-700 hover:bg-purple-600 text-white border border-purple-500"
          >
            {translating ? '번역 중…' : '현 페이지 한국어로 번역'}
          </button>
          {pageTranslation && (
            <>
              <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-[65vh] overflow-y-auto border border-slate-700 rounded p-3 bg-slate-800/50">
                {pageTranslation}
              </div>
              <button
                onClick={() => setPageTranslation('')}
                className="text-slate-500 text-xs hover:text-slate-300 text-right"
              >
                초기화
              </button>
            </>
          )}
          <p className="text-slate-600 text-xs">* 표·도식은 레이아웃이 깨질 수 있습니다</p>
        </div>
      </div>
    </div>
  )
}
