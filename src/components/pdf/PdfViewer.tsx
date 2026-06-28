'use client'

type Props = {
  url: string
  manualTitle: string
}

export default function PdfViewer({ url, manualTitle }: Props) {
  return (
    <div className="military-card overflow-hidden flex flex-col" style={{ height: '80vh', minHeight: '500px' }}>
      <div className="px-3 py-2 border-b border-slate-700 flex-shrink-0">
        <span className="text-slate-400 text-xs">PDF 미리보기</span>
      </div>
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        className="w-full flex-1"
        title={manualTitle}
      />
      <div className="px-3 py-3 border-t border-slate-700 bg-slate-900 flex flex-col gap-2">
        <p className="text-slate-400 text-xs">
          텍스트 선택이 필요하면 원본 PDF를 직접 여세요
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="military-btn-primary text-center py-2.5 text-sm rounded font-semibold"
        >
          📄 원본 PDF 열기
        </a>
      </div>
    </div>
  )
}
