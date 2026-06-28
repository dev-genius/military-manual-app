import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase 환경변수가 설정되지 않았습니다' }, { status: 500 })
  }

  const supabase = createClient(url, key)
  const isCommon = q.split(/\s+/).every(w => COMMON_WORDS.has(w))
  const limit = isCommon ? 10 : 50
  const ids = manualsParam ? manualsParam.split(',').filter(Boolean) : []

  // Query 1: 전체 교범별 빈도 집계 (최대 10,000행, 최소 필드만)
  let freqQuery = supabase
    .from('paragraphs')
    .select('manual_id, manual_number, manual_title')
    .ilike('text_en', `%${q}%`)
    .not('text_en', 'ilike', '%....%')
    .limit(10000)
  if (ids.length > 0) freqQuery = freqQuery.in('manual_id', ids)

  // Query 2: 상위 50개 문단 (표시용)
  let resultQuery = supabase
    .from('paragraphs')
    .select('id, manual_id, manual_number, manual_title, page, paragraph_no, text_en', { count: 'exact' })
    .ilike('text_en', `%${q}%`)
    .not('text_en', 'ilike', '%....%')
    .order('manual_number')
    .limit(limit)
  if (ids.length > 0) resultQuery = resultQuery.in('manual_id', ids)

  const [freqRes, resultRes] = await Promise.all([freqQuery, resultQuery])

  if (resultRes.error) return NextResponse.json({ error: resultRes.error.message }, { status: 500 })

  // 교범별 빈도 집계
  const countMap = new Map<string, { manual_id: string; manual_number: string; manual_title: string; count: number }>()
  for (const row of freqRes.data ?? []) {
    const key = row.manual_id
    if (!countMap.has(key)) {
      countMap.set(key, { manual_id: row.manual_id, manual_number: row.manual_number, manual_title: row.manual_title, count: 0 })
    }
    countMap.get(key)!.count++
  }
  const manualCounts = [...countMap.values()].sort((a, b) => b.count - a.count)

  return NextResponse.json({
    results: resultRes.data,
    total: resultRes.count,
    manualCounts,
  })
}
