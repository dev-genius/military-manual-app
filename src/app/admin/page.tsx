'use client'
import { useState, useRef } from 'react'
import type { Term } from '@/lib/supabase'
import Papa from 'papaparse'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState(false)

  function login() {
    if (password === 'admin1234') {
      setAuthed(true)
    } else {
      setAuthError(true)
    }
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-32">
        <div className="military-card p-8">
          <h1 className="text-white font-bold text-lg mb-6 text-center">관리자 로그인</h1>
          <input
            type="password"
            className="military-input mb-3"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          {authError && <div className="text-red-400 text-xs mb-3">비밀번호가 틀렸습니다</div>}
          <button onClick={login} className="military-btn-primary w-full py-2">로그인</button>
        </div>
      </div>
    )
  }

  return <AdminPanel />
}

function AdminPanel() {
  const [tab, setTab] = useState<'add' | 'import' | 'list'>('list')
  const [terms, setTerms] = useState<Term[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // 단건 추가 폼
  const [form, setForm] = useState({
    korean: '', english: '', abbreviation: '', definition_ko: '', definition_en: '', category: '',
  })

  async function loadTerms() {
    setLoading(true)
    const res = await fetch('/api/terms')
    const data = await res.json()
    setTerms(data.terms || [])
    setLoading(false)
  }

  async function addTerm() {
    const res = await fetch('/api/terms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.error) { setMsg('오류: ' + data.error); return }
    setMsg('✓ 용어가 추가되었습니다')
    setForm({ korean: '', english: '', abbreviation: '', definition_ko: '', definition_en: '', category: '' })
  }

  async function deleteTerm(id: number) {
    await fetch(`/api/terms?id=${id}`, { method: 'DELETE' })
    setTerms(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">관리자 패널</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {[['list', '용어 목록'], ['add', '단건 추가'], ['import', 'CSV Import']] .map(([k, v]) => (
          <button
            key={k}
            onClick={() => { setTab(k as 'add' | 'import' | 'list'); if (k === 'list') loadTerms() }}
            className={`px-4 py-2 rounded text-sm ${tab === k ? 'bg-blue-700 text-white' : 'military-btn'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {msg && <div className="text-green-400 text-sm mb-4 military-card p-3">{msg}</div>}

      {tab === 'add' && (
        <div className="military-card p-6 max-w-xl">
          <h2 className="text-white font-semibold mb-4">용어 추가</h2>
          <div className="space-y-3">
            {[
              ['korean', '한국어 *', '작전명령'],
              ['english', '영어 *', 'Operation Order'],
              ['abbreviation', '약어', 'OPORD'],
              ['definition_ko', '한국어 설명', ''],
              ['definition_en', '영어 설명', ''],
              ['category', '분류', '작전'],
            ].map(([key, label, ph]) => (
              <div key={key}>
                <label className="text-slate-400 text-xs block mb-1">{label}</label>
                <input
                  className="military-input"
                  placeholder={ph}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <button onClick={addTerm} className="military-btn-primary w-full py-2 mt-2">추가</button>
          </div>
        </div>
      )}

      {tab === 'import' && <CsvImport onDone={() => setMsg('✓ Import 완료')} />}

      {tab === 'list' && (
        <div>
          {loading ? (
            <div className="text-slate-400 text-center py-20">로딩 중...</div>
          ) : (
            <div className="space-y-2">
              {terms.map(t => (
                <div key={t.id} className="military-card px-5 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium mr-3">{t.korean}</span>
                    <span className="text-blue-300 text-sm">{t.english}</span>
                    {t.abbreviation && <span className="text-slate-400 text-xs ml-2">({t.abbreviation})</span>}
                    {t.category && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2">{t.category}</span>}
                  </div>
                  <button
                    onClick={() => deleteTerm(t.id)}
                    className="text-red-400 hover:text-red-300 text-xs px-3 py-1 rounded border border-red-900 hover:border-red-700"
                  >
                    삭제
                  </button>
                </div>
              ))}
              {terms.length === 0 && <div className="text-slate-500 text-center py-20">용어가 없습니다</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CsvImport({ onDone }: { onDone: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<Record<string, string>[]>([])
  const [importing, setImporting] = useState(false)
  const [msg, setMsg] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setPreview(result.data as Record<string, string>[])
      },
    })
  }

  async function doImport() {
    setImporting(true)
    const res = await fetch('/api/terms/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': 'admin1234',
      },
      body: JSON.stringify({ terms: preview }),
    })
    const data = await res.json()
    setImporting(false)
    if (data.error) { setMsg('오류: ' + data.error); return }
    setMsg(`✓ ${data.inserted}개 용어가 추가되었습니다`)
    setPreview([])
    onDone()
  }

  return (
    <div className="military-card p-6 max-w-2xl">
      <h2 className="text-white font-semibold mb-2">CSV 파일 Import</h2>
      <p className="text-slate-400 text-xs mb-4">
        열 이름: <code className="text-blue-300">korean, english, abbreviation, definition_ko, definition_en, category</code>
      </p>

      <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
      <button onClick={() => fileRef.current?.click()} className="military-btn mb-4">CSV 파일 선택</button>

      {msg && <div className="text-green-400 text-sm mb-4">{msg}</div>}

      {preview.length > 0 && (
        <>
          <div className="text-slate-400 text-sm mb-2">{preview.length}개 행 감지됨</div>
          <div className="overflow-x-auto military-card mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700">
                  {Object.keys(preview[0]).map(k => (
                    <th key={k} className="text-slate-400 px-3 py-2 text-left">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-slate-800">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="text-slate-300 px-3 py-2">{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={doImport} disabled={importing} className="military-btn-primary px-6 py-2 disabled:opacity-50">
            {importing ? 'Import 중...' : `${preview.length}개 Import`}
          </button>
        </>
      )}
    </div>
  )
}
