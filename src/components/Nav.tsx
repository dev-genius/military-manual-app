'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: '홈' },
  { href: '/manuals', label: '교범 목록' },
  { href: '/dictionary', label: '군사용어 사전' },
  { href: '/admin', label: '관리자' },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav style={{ background: '#060d1a', borderBottom: '1px solid #1e3a5f' }} className="px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-8">
        <span className="text-blue-400 font-bold text-lg tracking-widest">⚔ MILMAN</span>
        <div className="flex gap-1">
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
      </div>
    </nav>
  )
}
