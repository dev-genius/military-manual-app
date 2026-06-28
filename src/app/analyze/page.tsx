'use client'
import { useState } from 'react'
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

const ALL_MANUALS = [
  { id: 'adp-1',      number: 'ADP 1',      title: 'The Army' },
  { id: 'adp-1-01',   number: 'ADP 1-01',   title: 'Doctrine Primer' },
  { id: 'adp-2-0',    number: 'ADP 2-0',    title: 'Intelligence' },
  { id: 'adp-3-0',    number: 'ADP 3-0',    title: 'Operations' },
  { id: 'adp-3-05',   number: 'ADP 3-05',   title: 'Army Special Operations' },
  { id: 'adp-3-07',   number: 'ADP 3-07',   title: 'Stability' },
  { id: 'adp-3-13',   number: 'ADP 3-13',   title: 'Information' },
  { id: 'adp-3-19',   number: 'ADP 3-19',   title: 'Fires' },
  { id: 'adp-3-28',   number: 'ADP 3-28',   title: 'Defense Support of Civil Auth.' },
  { id: 'adp-3-37',   number: 'ADP 3-37',   title: 'Protection' },
  { id: 'adp-3-90',   number: 'ADP 3-90',   title: 'Offense and Defense' },
  { id: 'adp-5-0',    number: 'ADP 5-0',    title: 'The Operations Process' },
  { id: 'adp-6-0',    number: 'ADP 6-0',    title: 'Mission Command' },
  { id: 'fm-1',       number: 'FM 1',        title: 'The Army' },
  { id: 'fm-1-02-1',  number: 'FM 1-02.1',  title: 'Operational Terms' },
  { id: 'fm-1-02-2',  number: 'FM 1-02.2',  title: 'Military Symbols' },
  { id: 'fm-2-0',     number: 'FM 2-0',     title: 'Intelligence' },
  { id: 'fm-2-22-3',  number: 'FM 2-22.3',  title: 'Human Intelligence Ops' },
  { id: 'fm-3-0',     number: 'FM 3-0',     title: 'Operations' },
  { id: 'fm-3-01',    number: 'FM 3-01',    title: 'Air and Missile Defense' },
  { id: 'fm-3-01-44', number: 'FM 3-01.44', title: 'Short-Range Air Defense' },
  { id: 'fm-3-04',    number: 'FM 3-04',    title: 'Army Aviation' },
  { id: 'fm-3-05',    number: 'FM 3-05',    title: 'Army Special Operations' },
  { id: 'fm-3-07',    number: 'FM 3-07',    title: 'Stability' },
  { id: 'fm-3-90',    number: 'FM 3-90',    title: 'Tactics' },
  { id: 'fm-3-96',    number: 'FM 3-96',    title: 'Brigade Combat Team' },
  { id: 'fm-5-0',     number: 'FM 5-0',     title: 'Planning and Orders Production' },
  { id: 'fm-6-0',     number: 'FM 6-0',     title: 'Commander and Staff Org.' },
]

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
        교범별 출현 빈도 — &ldquo;{query}&rdquo;
      </h3>
      <div className="space-y-2">
        {data.map(d => (
          <div key={d.manual_id} className="flex items-center gap-2">
            <Link href={`/manuals/${d.manual_id}`} className="text-slate-400 text-xs w-24 shrink-0 hover:text-blue-300">
              {d.manual_number}
            </Link>
            <div className="flex-1 bg-slate-800 rounded h-4 overflow-hidden">
              <div className="h-full bg-blue-600 rounded" style={{ width: `${(d.count / max) * 100}%` }} />
            </div>
            <span className="text-slate-400 text-xs w-6 text-right">{d.count}</span>
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(ALL_MANUALS.map(m => m.id)))
  const [showManualPicker, setShowManualPicker] = useState(false)

  function toggleManual(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() { setSelectedIds(new Set(ALL_MANUALS.map(m => m.id))) }
  function clearAll() { setSelectedIds(new Set()) }

  async function doSearch(q: string) {
    if (!q.trim() || q.trim().length < 2) return
    if (selectedIds.size === 0) { setError('교범을 하나 이상 선택하세요.'); return }
    setLoading(true)
    setError('')
    setResults([])
    setTotal(null)
    setSearched(q.trim())
    try {
      const params = new URLSearchParams({ q: q.trim(), manuals: [...selectedIds].join(',') })
      const res = await fetch(`/api/search?${params}`)
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
      <h1 className="text-2xl font-bold text-white mb-4">교범 분석 — 용어 검색</h1>
      <div className="military-card p-4 flex flex-col gap-2 mb-6">
        <div className="flex items-start gap-2 text-sm text-slate-300">
          <span className="text-green-400 shrink-0">①</span>
          <span>교범에 사용되는 군사용어를 분석합니다.</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-300">
          <span className="text-green-400 shrink-0">②</span>
          <span>비교 교범을 선택하시고 원하는 군사용어를 입력하세요.</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-300">
          <span className="text-green-400 shrink-0">③</span>
          <span>선택한 교범에서 해당 군사용어가 사용된 주요 문단을 검색해줍니다.</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-300">
          <span className="text-green-400 shrink-0">④</span>
          <span>그 문단 페이지로 이동하셔서 <span className="text-purple-300 font-semibold">번역 기능</span>을 활용할 수 있습니다.</span>
        </div>
      </div>

      {/* 교범 선택 */}
      <div className="military-card p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-300 text-xs font-semibold tracking-widest">비교할 교범 선택</span>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs text-slate-400 hover:text-blue-300">전체 선택</button>
            <span className="text-slate-700">|</span>
            <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-400">전체 해제</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => setShowManualPicker(v => !v)} className="text-xs text-slate-400 hover:text-blue-300">
              {showManualPicker ? '접기 ▲' : `${selectedIds.size}개 선택됨 ▼`}
            </button>
          </div>
        </div>
        {showManualPicker && (
          <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-1">
            {ALL_MANUALS.map(m => (
              <label key={m.id} className="flex items-center gap-2 cursor-pointer group px-2 py-1.5 rounded hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedIds.has(m.id)}
                  onChange={() => toggleManual(m.id)}
                  className="accent-blue-500 shrink-0"
                />
                <span className="font-mono text-blue-400 text-xs w-20 shrink-0">{m.number}</span>
                <span className="text-slate-400 text-xs truncate group-hover:text-blue-200">{m.title}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 검색창 */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch(query)}
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
      <div className="text-slate-500 text-xs mb-6 space-y-0.5">
        <p>※ 일반 단어가 아닌 <span className="text-slate-400">군사용어</span>를 입력하세요.</p>
        <p>※ 일반용어 입력 시 최상위 10개의 문단만 제시됩니다.</p>
      </div>

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
              <Link
                href={`/translate/${r.manual_id}?page=${r.page}`}
                className="text-slate-500 text-xs ml-auto hover:text-purple-300 hover:underline"
                title="번역 페이지에서 열기"
              >
                {r.paragraph_no ? `§${r.paragraph_no} ` : ''}p.{r.page} 번역 ↗
              </Link>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {highlight(r.text_en, searched)}
            </p>
          </div>
        ))}
      </div>

      {results.length === 0 && total === 0 && !loading && searched && (
        <div className="text-center py-16 text-slate-500">검색 결과가 없습니다</div>
      )}
    </div>
  )
}
