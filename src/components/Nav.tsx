'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: '홈' },
  { href: '/manuals', label: '교범 목록' },
  { href: '/analyze', label: '교범 분석' },
  { href: '/dictionary', label: '군사용어 사전' },
  { href: '/admin', label: '관리자' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{ background: '#060d1a', borderBottom: '1px solid #1e3a5f' }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-blue-400 font-bold text-lg tracking-widest">⚔ MILMAN <span className="text-slate-500 text-xs font-normal tracking-normal">by YOO · v2026.06.28</span></span>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'bg-blue-900 text-blue-300'
                  : 'text-slate-400 hover:text-blue-300 hover:bg-slate-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(o => !o)}
          aria-label="메뉴"
        >
          <span className={`block w-5 h-0.5 bg-blue-400 transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-blue-400 transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-blue-400 transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* 공지 배너 */}
      <div className="text-center text-slate-500 text-xs py-1 px-4" style={{ borderBottom: '1px solid #1e3a5f', background: '#060d1a' }}>
        * 공개자료를 활용했으며, 일부 자료는 접속이 안될 수도 있습니다.
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {open && (
        <div style={{ borderTop: '1px solid #1e3a5f' }} className="md:hidden px-4 pb-3">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded text-sm font-medium transition-colors mt-1 ${
                pathname === l.href
                  ? 'bg-blue-900 text-blue-300'
                  : 'text-slate-400 hover:text-blue-300 hover:bg-slate-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
