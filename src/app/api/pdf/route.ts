import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const allowed = ['armypubs.army.mil', 'api.army.mil']
  const hostname = new URL(url).hostname
  if (!allowed.some(h => hostname.endsWith(h))) {
    return NextResponse.json({ error: 'Unauthorized source' }, { status: 403 })
  }

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: res.status })
  }

  const pdf = await res.arrayBuffer()

  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
