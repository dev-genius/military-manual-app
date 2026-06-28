import { MANUALS } from '@/lib/manuals'
import { notFound } from 'next/navigation'
import PdfTranslateViewer from '@/components/pdf/PdfTranslateViewer'

export default async function TranslateManualPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page } = await searchParams
  const manual = MANUALS.find(m => m.id === id)
  if (!manual) notFound()

  const initialPage = page ? parseInt(page, 10) : 1

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-purple-400 bg-purple-950 px-2 py-1 rounded">{manual.number}</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{manual.category}</span>
        </div>
        <h1 className="text-xl font-bold text-white">{manual.title}</h1>
      </div>
      <PdfTranslateViewer url={manual.url} initialPage={initialPage} />
    </div>
  )
}
