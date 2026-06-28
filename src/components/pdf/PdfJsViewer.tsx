'use client'
import { useEffect, useRef, useState } from 'react'

type Props = { url: string }

export default function PdfJsViewer({ url }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfRef = useRef<any>(null)
  const pageRef = useRef(1)
  const scaleRef = useRef(1.2)
  const renderIdRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    async function loadPdf() {
      setLoading(true)
      setError('')
      try {
        const pdfjsLib = await import('pdfjs-dist')
        // v3: 클래식 Worker 사용 (모든 브라우저 호환)
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

        if (!url) throw new Error('URL 없음')
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data }).promise
        if (cancelled) return
        pdfRef.current = pdf
        setTotalPages(pdf.numPages)
        setLoading(false)
        await renderPage(pdf, 1, scaleRef.current)
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('error')
        setLoading(false)
      }
    }
    loadPdf()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPage(pdf: any, pageNum: number, sc: number) {
    if (!containerRef.current) return
    const renderId = ++renderIdRef.current

    const container = containerRef.current
    container.innerHTML = ''

    const page = await pdf.getPage(pageNum)
    if (renderIdRef.current !== renderId) return

    const viewport = page.getViewport({ scale: sc })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = viewport.width
    canvas.height = viewport.height
    canvas.style.cssText = 'display:block; width:100%; height:auto;'

    const textLayerDiv = document.createElement('div')
    textLayerDiv.className = 'pdf-text-layer'
    const ratio = container.clientWidth / viewport.width
    textLayerDiv.style.cssText = `
      position:absolute; top:0; left:0;
      width:${viewport.width}px; height:${viewport.height}px;
      transform-origin:top left;
      transform:scale(${ratio || 1});
    `

    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'position:relative; width:100%;'
    wrapper.appendChild(canvas)
    wrapper.appendChild(textLayerDiv)
    container.appendChild(wrapper)

    await page.render({ canvasContext: ctx, viewport }).promise
    if (renderIdRef.current !== renderId) return

    // v3: renderTextLayer 방식
    const pdfjsLib = await import('pdfjs-dist')
    const textContent = await page.getTextContent()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjsAny = pdfjsLib as any
    if (pdfjsAny.renderTextLayer) {
      pdfjsAny.renderTextLayer({
        textContent,
        container: textLayerDiv,
        viewport,
        textDivs: [],
      })
    }
  }

  async function goToPage(pageNum: number) {
    if (!pdfRef.current || pageNum < 1 || pageNum > totalPages) return
    pageRef.current = pageNum
    setCurrentPage(pageNum)
    await renderPage(pdfRef.current, pageNum, scaleRef.current)
  }

  async function changeScale(newScale: number) {
    scaleRef.current = newScale
    setScale(newScale)
    if (pdfRef.current) await renderPage(pdfRef.current, pageRef.current, newScale)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => goToPage(pageRef.current - 1)} disabled={currentPage <= 1} className="military-btn px-3 py-1.5 text-sm disabled:opacity-30">◀</button>
          <span className="text-slate-300 text-sm whitespace-nowrap">{currentPage} / {totalPages || '…'}</span>
          <button onClick={() => goToPage(pageRef.current + 1)} disabled={currentPage >= totalPages} className="military-btn px-3 py-1.5 text-sm disabled:opacity-30">▶</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => changeScale(Math.max(0.5, +(scaleRef.current - 0.2).toFixed(1)))} className="military-btn px-3 py-1.5 text-sm">−</button>
          <span className="text-slate-300 text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => changeScale(Math.min(3.0, +(scaleRef.current + 0.2).toFixed(1)))} className="military-btn px-3 py-1.5 text-sm">+</button>
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
            <a href={url} target="_blank" rel="noopener noreferrer" className="military-btn-primary px-5 py-2 rounded text-sm">
              원본 PDF 열기 ↗
            </a>
          </div>
        )}
        <div ref={containerRef} />
      </div>
    </div>
  )
}
