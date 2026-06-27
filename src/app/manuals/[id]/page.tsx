import { MANUALS } from '@/lib/manuals'
import { notFound } from 'next/navigation'
import PdfViewer from '@/components/pdf/PdfViewer'

export default async function ManualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const manual = MANUALS.find(m => m.id === id)
  if (!manual) notFound()

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2 py-1 rounded">{manual.number}</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{manual.category}</span>
        </div>
        <h1 className="text-xl font-bold text-white">{manual.title}</h1>
        <p className="text-slate-400 text-sm mt-1">{manual.description}</p>
      </div>
      <PdfViewer url={manual.url} manualTitle={manual.title} />
    </div>
  )
}
