import Link from 'next/link'

export default function DictionaryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">군사용어 사전</h1>
        <p className="text-slate-400 text-sm">한국어 군사용어 ↔ 영어 대역 사전</p>
      </div>

      <div className="military-card p-12 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-6">🔧</div>
        <div className="text-yellow-400 font-semibold text-lg mb-2">데이터베이스 업데이트 중</div>
        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
          군사용어 사전 데이터를 구축하고 있습니다.<br />
          빠른 시일 내에 서비스할 예정입니다.
        </p>
        <div className="mt-6 flex gap-2 items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse delay-150" />
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse delay-300" />
        </div>
        <div className="mt-8 text-xs text-slate-600">
          교범 열람 및 번역 기능은 정상 이용 가능합니다 →{' '}
          <Link href="/manuals" className="text-blue-400 hover:text-blue-300">교범 목록 보기</Link>
        </div>
      </div>
    </div>
  )
}
