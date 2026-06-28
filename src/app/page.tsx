import Link from 'next/link'

const features = [
  {
    icon: '📖',
    title: '미군 교범 열람',
    desc: '미 육군 야전 교범(FM), 교리 발행물(ADP) 등을 PDF로 바로 열람',
    href: '/manuals',
  },
  {
    icon: '📚',
    title: '군사용어 사전',
    desc: '한국어 군사용어 검색 → 영어 변환 → 교범 내 해당 내용 검색',
    href: '/dictionary',
  },
]

const upcoming = [
  {
    icon: '🔤',
    title: '자동 번역 기능',
    desc: '교범 내용을 한국어로 실시간 번역. 군사 전문용어 특화',
  },
  {
    icon: '🇰🇷↔🇺🇸',
    title: '한미 군사용어 비교',
    desc: '한국군과 미군의 용어 차이를 비교하고 대응 개념을 확인',
  },
]

export default function Home() {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <div className="text-blue-400 text-sm tracking-[0.3em] mb-3 font-mono">UNCLASSIFIED // FOR OFFICIAL USE ONLY</div>
        <h1 className="text-4xl font-bold text-white mb-4">미군 교범 열람 시스템</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          미군 야전 교범을 한국어로 검색하고 열람하세요.<br />
          군사용어 사전으로 정확한 용어를 확인합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map(f => (
          <Link key={f.href + f.title} href={f.href}>
            <div className="military-card p-6 hover:border-blue-500 transition-colors cursor-pointer h-full">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h2 className="text-white font-semibold text-lg mb-2">{f.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 개발 예정 */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-slate-400 text-sm font-semibold tracking-widest">개발 예정</h2>
          <div className="flex-1 h-px bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map(u => (
            <div key={u.title} className="military-card p-5 opacity-60 border-dashed">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{u.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-slate-300 font-semibold text-sm">{u.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">준비 중</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{u.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="military-card p-6">
        <h3 className="text-blue-300 font-semibold mb-3 text-sm tracking-widest">QUICK SEARCH</h3>
        <QuickSearch />
      </div>
    </div>
  )
}

function QuickSearch() {
  return (
    <form action="/dictionary" method="get" className="flex gap-3">
      <input
        name="q"
        className="military-input flex-1"
        placeholder="한국어 군사용어 검색 (예: 작전명령, 화력지원)"
      />
      <button type="submit" className="military-btn-primary px-6 py-2 rounded">검색</button>
    </form>
  )
}
