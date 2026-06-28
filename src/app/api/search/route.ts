import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ error: '검색어를 입력하세요' }, { status: 400 })
  }

  // ILIKE로 대소문자 무시 검색, 단어 경계 포함
  const { data, error, count } = await supabase
    .from('paragraphs')
    .select('id, manual_id, manual_number, manual_title, page, paragraph_no, text_en', { count: 'exact' })
    .ilike('text_en', `%${q}%`)
    .order('manual_number')
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ results: data, total: count })
}
