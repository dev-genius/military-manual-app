'use client'
import { useEffect, useRef, useState } from 'react'

type Props = {
  url: string
}

export default function PdfJsViewer({ url }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    async function loadPdf() {
      setLoading(true)
      setError('')
      try {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
        const pdf = await pdfjsLib.getDocument({ url }).promise
        if (cancelled) return
        pdfRef.current = pdf
        setTotalPages(pdf.numPages)
        setLoading(false)
        await doRender(pdf, 1, scale)
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('PDF를 불러오지 못했습니다')
        setLoading(false)
      }
    }
    loadPdf()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function doRender(pdf: any, pageNum: number, sc: number) {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: sc })

    // 캔버스
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = viewport.width
    canvas.height = viewport.height
    canvas.style.cssText = `display:block; width:100%; height:auto;`

    // 텍스트 레이어
    const textLayerDiv = document.createElement('div')
    textLayerDiv.className = 'pdf-text-layer'
    textLayerDiv.style.cssText = `
      position:absolute; top:0; left:0;
      width:${viewport.width}px; height:${viewport.height}px;
      transform-origin:top left;
      transform:scale(${container.clientWidth / viewport.width});
    `

    const wrapper = document.createElement('div')
    wrapper.style.cssText = `position:relative; width:100%;`
    wrapper.appendChild(canvas)
    wrapper.appendChild(textLayerDiv)
    container.appendChild(wrapper)

    await page.render({ canvasContext: ctx, viewport }).promise

    // pdfjs v6: TextLayer 클래스 사용
    const pdfjsLib = await import('pdfjs-dist')
    const textContent = await page.getTextContent()

    if (pdfjsLib.TextLayer) {
      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport,
      })
      await textLayer.render()
    }
  }

  async function goToPage(pageNum: number) {
    if (!pdfRef.current || pageNum < 1 || pageNum > totalPages) return
    setCurrentPage(pageNum)
    await doRender(pdfRef.current, pageNum, scale)
  }

  async function changeScale(newScale: number) {
    setScale(newScale)
    if (pdfRef.current) await doRender(pdfRef.current, currentPage, newScale)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="military-btn px-2 py-1 text-xs disabled:opacity-30">◀</button>
          <span className="text-slate-400 text-xs whitespace-nowrap">{currentPage} / {totalPages || '…'}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="military-btn px-2 py-1 text-xs disabled:opacity-30">▶</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => changeScale(Math.max(0.7, +(scale - 0.2).toFixed(1)))} className="military-btn px-2 py-1 text-xs">−</button>
          <span className="text-slate-400 text-xs">{Math.round(scale * 100)}%</span>
          <button onClick={() => changeScale(Math.min(2.5, +(scale + 0.2).toFixed(1)))} className="military-btn px-2 py-1 text-xs">+</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-900 p-2">
        {loading && <div className="flex items-center justify-center h-40 text-slate-400 text-sm">PDF 로딩 중…</div>}
        {error && (
          <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
            <div className="text-3xl">⚠️</div>
            <div>
              <p className="text-red-400 font-semibold mb-1">PDF를 불러오지 못했습니다</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                서버 사정에 따라 일부 자료는 직접 접속이 안될 수 있습니다.<br />
                아래 버튼으로 원본 사이트에서 직접 열어보세요.
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="military-btn-primary px-5 py-2 rounded text-sm"
            >
              원본 PDF 열기 ↗
            </a>
          </div>
        )}
        <div ref={containerRef} />
      </div>
    </div>
  )
}
