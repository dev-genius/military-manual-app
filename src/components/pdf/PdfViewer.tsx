'use client'
import PdfJsViewer from './PdfJsViewer'

type Props = {
  url: string
  manualTitle: string
}

export default function PdfViewer({ url, manualTitle }: Props) {
  return (
    <div className="military-card overflow-hidden flex flex-col" style={{ height: '85vh', minHeight: '500px' }}>
      <div className="px-3 py-2 border-b border-slate-700 flex-shrink-0 flex items-center justify-between">
        <span className="text-slate-400 text-xs">PDF 뷰어 — 텍스트 드래그 선택 및 검색 가능</span>
      </div>
      <PdfJsViewer url={url} />
    </div>
  )
}
