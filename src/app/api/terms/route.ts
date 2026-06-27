import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  let builder = supabase
    .from('terms')
    .select('*')
    .order('korean', { ascending: true })

  if (query) {
    builder = builder.or(`korean.ilike.%${query}%,english.ilike.%${query}%,abbreviation.ilike.%${query}%`)
  }
  if (category) {
    builder = builder.eq('category', category)
  }

  const { data, error } = await builder.limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ terms: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { korean, english, abbreviation, definition_ko, definition_en, category } = body

  if (!korean || !english) {
    return NextResponse.json({ error: '한국어, 영어 용어는 필수입니다' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('terms')
    .insert([{ korean, english, abbreviation, definition_ko, definition_en, category }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ term: data })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body

  const { data, error } = await supabase
    .from('terms')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ term: data })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { error } = await supabase.from('terms').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
