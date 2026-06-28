'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

type Result = {
  id: number
  manual_id: string
  manual_number: string
  manual_title: string
  page: number
  paragraph_no: string | null
  text_en: string
}

type FreqEntry = { manual_number: string; manual_title: string; manual_id: string; count: number }

function highlight(text: string, q: string) {
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-400/30 text-yellow-200 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}

function FreqBar({ data, query }: { data: FreqEntry[]; query: string }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="military-card p-4 mb-4">
      <h3 className="text-blue-300 text-xs font-semibold tracking-widest mb-3">
        교범별 출현 빈도 — &quot;{query}&quot;
      </h3>
      <div className="space-y-2">
        {data.map(d => (
          <div key={d.manual_id} className="flex items-center gap-2">
            <Link
              href={`/manuals/${d.manual_id}`}
              className="text-slate-400 text-xs w-20 shrink-0 hover:text-blue-300"
            >
              {d.manual_number}
            </Link>
            <div className="flex-1 bg-slate-800 rounded h-4 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded transition-all"
                style={{ width: `${(d.count / max) * 100}%` }}
              />
            </div>
            <span className="text-slate-400 text-xs w-8 text-right">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function doSearch(q: string) {
    if (!q.trim() || q.trim().length < 2) return
    setLoading(true)
    setError('')
    setResults([])
    setTotal(null)
    setSearched(q.trim())
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setResults(data.results ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setError('검색 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') doSearch(query)
  }

  // 교범별 빈도 집계
  const freqMap = new Map<string, FreqEntry>()
  for (const r of results) {
    if (!freqMap.has(r.manual_id)) {
      freqMap.set(r.manual_id, { manual_id: r.manual_id, manual_number: r.manual_number, manual_title: r.manual_title, count: 0 })
    }
    freqMap.get(r.manual_id)!.count++
  }
  const freqData = [...freqMap.values()].sort((a, b) => b.count - a.count)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">용어/문구 검색</h1>
      <p className="text-slate-400 text-sm mb-6">60개 미군 교범에서 문단 단위로 검색합니다</p>

      {/* 검색창 */}
      <div className="flex gap-2 mb-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="군사 용어/문구를 입력하세요 (예: convergence, mission command)"
          className="military-input flex-1 text-sm"
        />
        <button
          onClick={() => doSearch(query)}
          disabled={loading}
          className="military-btn-primary px-5 py-2 text-sm shrink-0 disabled:opacity-50"
        >
          {loading ? '검색 중…' : '검색'}
        </button>
      </div>
      <p className="text-slate-600 text-xs mb-6">
        ※ 일반 단어(the, and 등) 검색 시 결과가 과다하게 표시될 수 있습니다
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* 결과 요약 */}
      {total !== null && (
        <p className="text-slate-400 text-xs mb-4">
          결과 <span className="text-white font-semibold">{total.toLocaleString()}</span>개 중{' '}
          <span className="text-white font-semibold">{results.length}</span>개 표시
        </p>
      )}

      {/* 빈도 시각화 */}
      {freqData.length > 0 && <FreqBar data={freqData} query={searched} />}

      {/* 결과 목록 */}
      <div className="space-y-3">
        {results.map(r => (
          <div key={r.id} className="military-card p-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Link href={`/manuals/${r.manual_id}`}>
                <span className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded font-semibold hover:bg-blue-800">
                  {r.manual_number}
                </span>
              </Link>
              <span className="text-slate-500 text-xs">{r.manual_title}</span>
              <span className="text-slate-600 text-xs ml-auto">
                {r.paragraph_no ? `§${r.paragraph_no}` : ''} p.{r.page}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {highlight(r.text_en, searched)}
            </p>
          </div>
        ))}
      </div>

      {results.length === 0 && total === 0 && !loading && (
        <div className="text-center py-16 text-slate-500">검색 결과가 없습니다</div>
      )}
    </div>
  )
}
