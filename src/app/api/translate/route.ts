import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const { text, targetLang = 'KO' } = await req.json()

  if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const isToKorean = targetLang === 'KO'
  const prompt = isToKorean
    ? `다음 영어 군사 텍스트를 한국어로 번역하세요. 군사 전문용어는 한국 군에서 사용하는 공식 용어로 번역하세요. 번역문만 출력하고 설명은 하지 마세요.\n\n${text}`
    : `다음 한국어 군사 용어를 영어로 번역하세요. 미군 공식 군사용어(FM, ADP 등에서 사용하는 용어)로 번역하세요. 번역문만 출력하고 설명은 하지 마세요.\n\n${text}`

  const result = await model.generateContent(prompt)
  const translated = result.response.text().trim()

  return NextResponse.json({ translated })
}
