'use client'
import PdfJsViewer from './PdfJsViewer'

type Props = { url: string; manualTitle: string; initialPage?: number }

export default function PdfViewer({ url, initialPage = 1 }: Props) {
  return (
    <div className="military-card overflow-hidden flex flex-col" style={{ height: '85vh', minHeight: '500px' }}>
      <PdfJsViewer url={url} initialPage={initialPage} />
    </div>
  )
}
