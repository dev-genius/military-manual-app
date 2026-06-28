'use client'
import { useEffect, useRef, useState } from 'react'

export default function PdfJsViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfRef = useRef<any>(null)
  const pageRef = useRef(1)
  const renderIdRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data }).promise
        if (cancelled) return

        pdfRef.current = pdf
        setTotalPages(pdf.numPages)
        setLoading(false)
        renderPage(pdf, 1)
      } catch (e) {
        console.error(e)
        if (!cancelled) { setError(true); setLoading(false) }
      }
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPage(pdf: any, pageNum: number) {
    const container = containerRef.current
    if (!container) return

    const renderId = ++renderIdRef.current
    container.innerHTML = ''

    const page = await pdf.getPage(pageNum)
    if (renderIdRef.current !== renderId) return

    // 컨테이너 너비에 딱 맞는 scale 계산 → CSS transform 불필요
    const containerWidth = container.clientWidth || 400
    const baseViewport = page.getViewport({ scale: 1 })
    const scale = containerWidth / baseViewport.width
    const viewport = page.getViewport({ scale })

    // ── 캔버스 ──
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    canvas.style.cssText = 'display:block; width:100%; height:auto;'

    // ── 텍스트 레이어 (canvas와 동일한 크기, transform 없음) ──
    const textDiv = document.createElement('div')
    textDiv.className = 'pdf-text-layer'
    textDiv.style.cssText = `
      position:absolute; top:0; left:0;
      width:${viewport.width}px;
      height:${viewport.height}px;
    `

    const wrapper = document.createElement('div')
    wrapper.style.cssText = `position:relative; width:100%; height:${viewport.height}px;`
    wrapper.appendChild(canvas)
    wrapper.appendChild(textDiv)
    container.appendChild(wrapper)

    // 캔버스 렌더링
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise
    if (renderIdRef.current !== renderId) return

    // 텍스트 레이어 렌더링 (v3 API)
    try {
      const pdfjs = await import('pdfjs-dist')
      const textContent = await page.getTextContent()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(pdfjs as any).renderTextLayer({
        textContent,
        container: textDiv,
        viewport,
        textDivs: [],
      })
    } catch {
      // 텍스트 레이어 실패해도 PDF는 보임
    }
  }

  function goToPage(n: number) {
    if (!pdfRef.current || n < 1 || n > totalPages) return
    pageRef.current = n
    setCurrentPage(n)
    renderPage(pdfRef.current, n)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(pageRef.current - 1)}
            disabled={currentPage <= 1}
            className="military-btn px-3 py-1.5 text-sm disabled:opacity-30"
          >◀</button>
          <span className="text-slate-300 text-sm whitespace-nowrap">
            {currentPage} / {totalPages || '…'}
          </span>
          <button
            onClick={() => goToPage(pageRef.current + 1)}
            disabled={currentPage >= totalPages}
            className="military-btn px-3 py-1.5 text-sm disabled:opacity-30"
          >▶</button>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 text-xs hover:text-blue-300"
        >
          원본 ↗
        </a>
      </div>

      {/* PDF 영역 */}
      <div className="flex-1 overflow-auto bg-slate-900 p-2">
        {loading && (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
            PDF 로딩 중…
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
            <div className="text-3xl">⚠️</div>
            <p className="text-red-400 font-semibold">PDF를 불러오지 못했습니다</p>
            <p className="text-slate-400 text-xs">서버 사정에 따라 일부 자료는 접속이 안될 수 있습니다.</p>
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
