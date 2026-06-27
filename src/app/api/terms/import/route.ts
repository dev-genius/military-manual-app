import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '권한 없음' }, { status: 401 })
  }

  const body = await req.json()
  const { terms } = body

  if (!Array.isArray(terms) || terms.length === 0) {
    return NextResponse.json({ error: '유효한 데이터가 없습니다' }, { status: 400 })
  }

  const rows = terms.map((t: Record<string, string>) => ({
    korean: t.korean || t['한국어'] || '',
    english: t.english || t['영어'] || '',
    abbreviation: t.abbreviation || t['약어'] || null,
    definition_ko: t.definition_ko || t['한국어설명'] || null,
    definition_en: t.definition_en || t['영어설명'] || null,
    category: t.category || t['분류'] || null,
  })).filter(r => r.korean && r.english)

  const { data, error } = await supabase.from('terms').insert(rows).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inserted: data?.length ?? 0 })
}
