'use client'
import { MANUALS, CATEGORIES } from '@/lib/manuals'
import { useState } from 'react'
import Link from 'next/link'

type PubType = 'ADP' | 'FM'

export default function ManualsPage() {
  const [pubType, setPubType] = useState<PubType>('ADP')
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')

  const filtered = MANUALS.filter(m => {
    const matchType = m.number.startsWith(pubType)
    const matchCat = category === '전체' || m.category === category
    const matchSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.number.toLowerCase().includes(search.toLowerCase()) ||
      m.description.includes(search)
    return matchType && matchCat && matchSearch
  })

  const adpCount = MANUALS.filter(m => m.number.startsWith('ADP')).length
  const fmCount = MANUALS.filter(m => m.number.startsWith('FM')).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">교범 목록</h1>
        <p className="text-slate-400 text-sm">교범을 클릭하면 PDF를 바로 열람할 수 있습니다</p>
      </div>

      {/* ADP / FM 탭 */}
      <div className="flex gap-2 mb-5">
        {(['ADP', 'FM'] as PubType[]).map(t => (
          <button
            key={t}
            onClick={() => { setPubType(t); setCategory('전체') }}
            className={`px-6 py-2.5 rounded font-semibold text-sm transition-colors ${
              pubType === t
                ? 'bg-blue-700 text-white border border-blue-500'
                : 'military-btn'
            }`}
          >
            {t}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              pubType === t ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}>
              {t === 'ADP' ? adpCount : fmCount}
            </span>
          </button>
        ))}
      </div>

      {/* 검색 + 카테고리 */}
      <div className="flex flex-col gap-3 mb-5">
        <input
          className="military-input"
          placeholder="교범명 또는 번호 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                category === c ? 'bg-blue-700 text-white' : 'military-btn'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-slate-500 text-center py-20">검색 결과가 없습니다</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <Link key={m.id} href={`/manuals/${m.id}`}>
              <div className="military-card p-5 hover:border-blue-500 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2 py-1 rounded">{m.number}</span>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{m.category}</span>
                </div>
                <h2 className="text-white font-semibold mb-2 text-sm leading-relaxed">{m.title}</h2>
                <p className="text-slate-400 text-xs">{m.description}</p>
                <div className="mt-4 text-blue-400 text-xs flex items-center gap-1">
                  <span>📄</span> PDF 열람
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
