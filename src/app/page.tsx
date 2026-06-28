import Link from 'next/link'

const services = [
  {
    num: '01',
    icon: '📖',
    title: '교범 원문 열람',
    subtitle: 'PDF Viewer',
    desc: '미 육군 야전 교범(FM), 교리 발행물(ADP) 원문을 PDF로 바로 열람합니다.',
    href: '/manuals',
    color: 'border-blue-700 hover:border-blue-400',
    badge: '27개 교범',
  },
  {
    num: '02',
    icon: '🔍',
    title: '교범 분석',
    subtitle: 'Term Search',
    desc: '군사용어를 입력하면 27개 교범에서 해당 문단을 추출하고 교범별 사용 빈도를 시각화합니다.',
    href: '/search',
    color: 'border-green-700 hover:border-green-400',
    badge: '14,000+ 문단',
  },
  {
    num: '03',
    icon: '🌐',
    title: '교범 번역',
    subtitle: 'AI Translation',
    desc: '현재 열람 중인 교범 페이지를 AI가 한국어로 번역합니다. 군사 전문용어 특화.',
    href: '/manuals',
    color: 'border-purple-700 hover:border-purple-400',
    badge: 'Gemini AI',
  },
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="text-center mb-14">
        <div className="text-blue-400 text-xs tracking-[0.3em] mb-3 font-mono">UNCLASSIFIED // FOR OFFICIAL USE ONLY</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">미군 교범 열람 시스템</h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
          미군 야전 교범을 열람하고, 군사용어를 검색하고, AI로 번역하세요.
        </p>
      </div>

      {/* 3대 서비스 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {services.map(s => (
          <Link key={s.href + s.num} href={s.href}>
            <div className={`military-card p-6 cursor-pointer border ${s.color} transition-colors h-full flex flex-col`}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-slate-600 font-mono text-xs">{s.num}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{s.badge}</span>
              </div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h2 className="text-white font-bold text-lg mb-0.5">{s.title}</h2>
              <div className="text-slate-500 text-xs mb-3 font-mono">{s.subtitle}</div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-4 text-blue-400 text-xs font-semibold">바로가기 →</div>
            </div>
          </Link>
        ))}
      </div>

      {/* 수록 교범 목록 */}
      <div className="military-card p-6">
        <h3 className="text-blue-300 text-xs font-semibold tracking-widest mb-4">수록 교범 목록 (27개)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5">
          {MANUAL_LIST.map(m => (
            <Link key={m.id} href={`/manuals/${m.id}`} className="text-slate-400 text-xs hover:text-blue-300 truncate">
              · {m.number} {m.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const MANUAL_LIST = [
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
  { id: 'fm-1',       number: 'FM 1',       title: 'The Army' },
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
