// =====================================================
// 손상된 38개 PDF 재업로드 스크립트
// 1. https://armypubs.army.mil 접속
// 2. F12 → Console
// 3. 전체 복사 → 붙여넣기 → Enter
// =====================================================

const SUPABASE_URL = 'https://lsvsoleegbkoyfkelnay.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdnNvbGVlZ2Jrb3lma2VsbmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTE2NjYsImV4cCI6MjA5ODE2NzY2Nn0.2La0EIrejD045vG5AiTVZSkpY6VhZ1k6ZicoLoaSyng'
const BUCKET = 'manuals'

// 손상된 38개만
const FILES = [
  {"id":"adp-4-0",   "path":"/epubs/DR_pubs/DR_a/ARN45863-ADP_4-0-000-WEB-1.pdf"},
  {"id":"adp-5-0",   "path":"/epubs/DR_pubs/DR_a/pdf/web/ARN18012_ADP 5-0 FINAL WEB.pdf"},
  {"id":"adp-6-0",   "path":"/epubs/DR_pubs/DR_a/pdf/web/ARN18013_ADP 6-0 FINAL WEB.pdf"},
  {"id":"adp-6-22",  "path":"/epubs/DR_pubs/DR_a/ARN20039-ADP_6-22-001-WEB-3.pdf"},
  {"id":"adp-7-0",   "path":"/epubs/DR_pubs/DR_a/ARN40951-ADP_7-0-000-WEB-1.pdf"},
  {"id":"fm-3-09",   "path":"/epubs/DR_pubs/DR_a/ARN41234-FM_3-09-000-WEB-1.pdf"},
  {"id":"fm-3-11",   "path":"/epubs/DR_pubs/DR_a/ARN43369-FM_3-11-000-WEB-1.pdf"},
  {"id":"fm-3-12",   "path":"/epubs/DR_pubs/DR_a/ARN44955-FM_3-12-000-WEB-1.pdf"},
  {"id":"fm-3-14",   "path":"/epubs/DR_pubs/DR_a/ARN45804-FM_3-14-000-WEB-1.pdf"},
  {"id":"fm-3-16",   "path":"/epubs/DR_pubs/DR_a/ARN40998-FM_3-16-000-WEB-1.pdf"},
  {"id":"fm-3-22",   "path":"/epubs/DR_pubs/DR_a/ARN38035-FM_3-22-000-WEB-1.pdf"},
  {"id":"fm-3-27",   "path":"/epubs/DR_pubs/DR_a/ARN38282-FM_3-27-000-WEB-1.pdf"},
  {"id":"fm-3-34",   "path":"/epubs/DR_pubs/DR_a/ARN45484-FM_3-34-000-WEB-1.pdf"},
  {"id":"fm-3-39",   "path":"/epubs/DR_pubs/DR_a/ARN43413-FM_3-39-000-WEB-1.pdf"},
  {"id":"fm-3-52",   "path":"/epubs/DR_pubs/DR_a/ARN34015-FM_3-52-000-WEB-1.pdf"},
  {"id":"fm-3-57",   "path":"/epubs/DR_pubs/DR_a/ARN33818-FM_3-57-000-WEB-1.pdf"},
  {"id":"fm-3-60",   "path":"/epubs/DR_pubs/DR_a/ARN38285-FM_3-60-000-WEB-1.pdf"},
  {"id":"fm-3-61",   "path":"/epubs/DR_pubs/DR_a/ARN36531-FM_3-61-000-WEB-1.pdf"},
  {"id":"fm-3-63",   "path":"/epubs/DR_pubs/DR_a/ARN45817-FM_3-63-000-WEB-1.pdf"},
  {"id":"fm-3-81",   "path":"/epubs/DR_pubs/DR_a/ARN35546-FM_3-81-000-WEB-1.pdf"},
  {"id":"fm-3-83",   "path":"/epubs/DR_pubs/DR_a/ARN43369-FM_3-83-000-WEB-1.pdf"},
  {"id":"fm-3-84",   "path":"/epubs/DR_pubs/DR_a/ARN38338-FM_3-84-000-WEB-1.pdf"},
  {"id":"fm-3-90",   "path":"/epubs/DR_pubs/DR_a/ARN37571-FM_3-90-000-WEB-1.pdf"},
  {"id":"fm-3-94",   "path":"/epubs/DR_pubs/DR_a/ARN33547-FM_3-94-000-WEB-1.pdf"},
  {"id":"fm-3-96",   "path":"/epubs/DR_pubs/DR_a/ARN31692-FM_3-96-000-WEB-1.pdf"},
  {"id":"fm-3-98",   "path":"/epubs/DR_pubs/DR_a/ARN37146-FM_3-98-000-WEB-1.pdf"},
  {"id":"fm-3-99",   "path":"/epubs/DR_pubs/DR_a/ARN43476-FM_3-99-000-WEB-1.pdf"},
  {"id":"fm-4-0",    "path":"/epubs/DR_pubs/DR_a/ARN45862-FM_4-0-000-WEB-1.pdf"},
  {"id":"fm-4-02",   "path":"/epubs/DR_pubs/DR_a/ARN32286-FM_4-02-000-WEB-1.pdf"},
  {"id":"fm-4-80",   "path":"/epubs/DR_pubs/DR_a/ARN43407-FM_4-80-000-WEB-1.pdf"},
  {"id":"fm-5-0",    "path":"/epubs/DR_pubs/DR_a/ARN41902-FM_5-0-000-WEB-1.pdf"},
  {"id":"fm-6-0",    "path":"/epubs/DR_pubs/DR_a/ARN36054-FM_6-0-000-WEB-1.pdf"},
  {"id":"fm-6-02",   "path":"/epubs/DR_pubs/DR_a/ARN18206-FM_6-02-000-WEB-2.pdf"},
  {"id":"fm-6-22",   "path":"/epubs/DR_pubs/DR_a/ARN36671-FM_6-22-000-WEB-1.pdf"},
  {"id":"fm-6-27",   "path":"/epubs/DR_pubs/DR_a/ARN18207-FM_6-27-000-WEB-2.pdf"},
  {"id":"fm-6-99",   "path":"/epubs/DR_pubs/DR_a/ARN33243-FM_6-99-000-WEB-1.pdf"},
  {"id":"fm-7-0",    "path":"/epubs/DR_pubs/DR_a/ARN33369-FM_7-0-000-WEB-1.pdf"},
  {"id":"fm-7-22",   "path":"/epubs/DR_pubs/DR_a/ARN30714-FM_7-22-000-WEB-2.pdf"},
]

async function uploadPdf(file) {
  const url = 'https://armypubs.army.mil' + file.path
  const filename = file.id + '.pdf'
  try {
    console.log(`[${file.id}] 다운로드 중...`)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    if (blob.size < 10000) throw new Error(`파일 너무 작음 (${blob.size} bytes) - 잘못된 URL일 수 있음`)

    console.log(`[${file.id}] 업로드 중... (${(blob.size/1024/1024).toFixed(1)}MB)`)
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/pdf',
          'x-upsert': 'true',
        },
        body: blob,
      }
    )
    if (!uploadRes.ok) throw new Error(await uploadRes.text())
    console.log(`✅ [${file.id}] 완료 (${(blob.size/1024/1024).toFixed(1)}MB)`)
    return true
  } catch (e) {
    console.error(`❌ [${file.id}] 실패: ${e.message}`)
    return false
  }
}

async function uploadAll() {
  console.log(`손상된 ${FILES.length}개 재업로드 시작...`)
  let success = 0, fail = 0, failList = []
  for (const file of FILES) {
    const ok = await uploadPdf(file)
    ok ? success++ : (fail++, failList.push(file.id))
    await new Promise(r => setTimeout(r, 800))
  }
  console.log(`\n🎉 완료! 성공: ${success}, 실패: ${fail}`)
  if (failList.length) console.log('실패 목록:', failList)
}

uploadAll()
