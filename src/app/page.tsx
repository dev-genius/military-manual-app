import Link from 'next/link'

const features = [
  {
    icon: '📖',
    title: '미군 교범 열람',
    desc: '미 육군 야전 교범(FM), 교리 발행물(ADP) 등을 PDF로 바로 열람',
    href: '/manuals',
    color: '#1d4ed8',
  },
  {
    icon: '🔤',
    title: '자동 번역',
    desc: '교범 내용을 한국어로 실시간 번역. 군사 전문용어 정확도 높음',
    href: '/manuals',
    color: '#0f766e',
  },
  {
    icon: '📚',
    title: '군사용어 사전',
    desc: '한국어 군사용어 검색 → 영어 변환 → 교범 내 해당 내용 검색',
    href: '/dictionary',
    color: '#7c3aed',
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
