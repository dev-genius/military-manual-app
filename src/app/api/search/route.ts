import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 흔한 일반 단어 — 이 단어 검색 시 10개로 제한
const COMMON_WORDS = new Set([
  'the','a','an','and','or','of','in','on','to','for','is','are','was','were',
  'be','been','being','have','has','had','do','does','did','will','would','could',
  'should','may','might','shall','can','not','no','at','by','from','with','as',
  'it','its','this','that','these','those','they','their','there','all','any',
  'each','which','who','what','when','where','how','force','forces','unit','units',
  'Army','army','operation','operations','military','command','mission',
])

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  const manualsParam = req.nextUrl.searchParams.get('manuals')

  if (!q || q.length < 2) {
    return NextResponse.json({ error: '검색어를 2자 이상 입력하세요' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const isCommon = q.split(/\s+/).every(w => COMMON_WORDS.has(w))
  const limit = isCommon ? 10 : 50

  let query = supabase
    .from('paragraphs')
    .select('id, manual_id, manual_number, manual_title, page, paragraph_no, text_en', { count: 'exact' })
    .ilike('text_en', `%${q}%`)
    .order('manual_number')
    .limit(limit)

  // 교범 필터
  if (manualsParam) {
    const ids = manualsParam.split(',').filter(Boolean)
    if (ids.length > 0) query = query.in('manual_id', ids)
  }

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ results: data, total: count })
}
