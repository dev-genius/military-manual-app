"""
MILMAN 전처리 스크립트
PDF 60개 → 문단 파싱 → Supabase DB 저장

실행: python3 scripts/extract_paragraphs.py
"""

import re
import sys
import time
import urllib.request
from supabase import create_client

# ── 설정 ──────────────────────────────────────────────────────
SUPABASE_URL = "https://lsvsoleegbkoyfkelnay.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdnNvbGVlZ2Jrb3lma2VsbmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTE2NjYsImV4cCI6MjA5ODE2NzY2Nn0.2La0EIrejD045vG5AiTVZSkpY6VhZ1k6ZicoLoaSyng"
STORAGE_BASE = f"{SUPABASE_URL}/storage/v1/object/public/manuals"

MANUALS = [
    ("adp-1",      "ADP 1",       "The Army"),
    ("adp-1-01",   "ADP 1-01",    "Doctrine Primer"),
    ("adp-2-0",    "ADP 2-0",     "Intelligence"),
    ("adp-3-0",    "ADP 3-0",     "Operations"),
    ("adp-3-05",   "ADP 3-05",    "Army Special Operations"),
    ("adp-3-07",   "ADP 3-07",    "Stability"),
    ("adp-3-13",   "ADP 3-13",    "Information"),
    ("adp-3-19",   "ADP 3-19",    "Fires"),
    ("adp-3-28",   "ADP 3-28",    "Defense Support of Civil Authorities"),
    ("adp-3-37",   "ADP 3-37",    "Protection"),
    ("adp-3-90",   "ADP 3-90",    "Offense and Defense"),
    ("adp-4-0",    "ADP 4-0",     "Sustainment"),
    ("adp-5-0",    "ADP 5-0",     "The Operations Process"),
    ("adp-6-0",    "ADP 6-0",     "Mission Command"),
    ("adp-6-22",   "ADP 6-22",    "Army Leadership and the Profession"),
    ("adp-7-0",    "ADP 7-0",     "Training"),
    ("fm-1",       "FM 1",        "The Army: A Primer to Our Profession of Arms"),
    ("fm-1-02-1",  "FM 1-02.1",   "Operational Terms"),
    ("fm-1-02-2",  "FM 1-02.2",   "Military Symbols"),
    ("fm-2-0",     "FM 2-0",      "Intelligence"),
    ("fm-2-22-3",  "FM 2-22.3",   "Human Intelligence Collector Operations"),
    ("fm-3-0",     "FM 3-0",      "Operations"),
    ("fm-3-01",    "FM 3-01",     "U.S. Army Air and Missile Defense"),
    ("fm-3-01-44", "FM 3-01.44",  "Short-Range Air Defense Operations"),
    ("fm-3-04",    "FM 3-04",     "Army Aviation"),
    ("fm-3-05",    "FM 3-05",     "Army Special Operations"),
    ("fm-3-07",    "FM 3-07",     "Stability"),
    ("fm-3-09",    "FM 3-09",     "Fire Support and Field Artillery"),
    ("fm-3-11",    "FM 3-11",     "CBRN Operations"),
    ("fm-3-12",    "FM 3-12",     "Cyberspace and EW Operations"),
    ("fm-3-14",    "FM 3-14",     "Army Space Operations"),
    ("fm-3-16",    "FM 3-16",     "Army in Multinational Operations"),
    ("fm-3-22",    "FM 3-22",     "Army Support to Security Cooperation"),
    ("fm-3-27",    "FM 3-27",     "Army Global Missile Defense"),
    ("fm-3-34",    "FM 3-34",     "Engineer Operations"),
    ("fm-3-39",    "FM 3-39",     "Military Police Operations"),
    ("fm-3-52",    "FM 3-52",     "Airspace Control"),
    ("fm-3-57",    "FM 3-57",     "Civil Affairs Operations"),
    ("fm-3-60",    "FM 3-60",     "Army Targeting"),
    ("fm-3-61",    "FM 3-61",     "Communication Strategy and Public Affairs"),
    ("fm-3-63",    "FM 3-63",     "Detainee Operations"),
    ("fm-3-81",    "FM 3-81",     "Maneuver Enhancement Brigade"),
    ("fm-3-83",    "FM 3-83",     "Religious Affairs"),
    ("fm-3-84",    "FM 3-84",     "Legal Support to Operations"),
    ("fm-3-90",    "FM 3-90",     "Tactics"),
    ("fm-3-94",    "FM 3-94",     "Armies, Corps, and Division Operations"),
    ("fm-3-96",    "FM 3-96",     "Brigade Combat Team"),
    ("fm-3-98",    "FM 3-98",     "Reconnaissance and Security Operations"),
    ("fm-3-99",    "FM 3-99",     "Airborne and Air Assault Operations"),
    ("fm-4-0",     "FM 4-0",      "Sustainment Operations"),
    ("fm-4-02",    "FM 4-02",     "Army Health System"),
    ("fm-4-80",    "FM 4-80",     "Financial Management Operations"),
    ("fm-5-0",     "FM 5-0",      "Planning and Orders Production"),
    ("fm-6-0",     "FM 6-0",      "Commander and Staff Organization"),
    ("fm-6-02",    "FM 6-02",     "Signal Support to Operations"),
    ("fm-6-22",    "FM 6-22",     "Developing Leaders"),
    ("fm-6-27",    "FM 6-27",     "Commander's Handbook on Law of Land Warfare"),
    ("fm-6-99",    "FM 6-99",     "U.S. Army Report and Message Formats"),
    ("fm-7-0",     "FM 7-0",      "Training"),
    ("fm-7-22",    "FM 7-22",     "Holistic Health and Fitness"),
]

# 미군 교범 문단 번호 패턴: "1-1.", "2-12.", "A-3." 등
PARA_PATTERN = re.compile(r'^([A-Z]?\d+-\d+)\.\s+', re.MULTILINE)

MIN_TEXT_LEN = 80  # 너무 짧은 텍스트(헤더/푸터 등) 제외


def extract_paragraphs(pdf_bytes: bytes, manual_id: str, manual_number: str, manual_title: str):
    """PDF bytes → 문단 리스트"""
    import fitz  # pymupdf
    rows = []

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text")
        if not text.strip():
            continue

        # 문단 번호 패턴으로 분리 시도
        splits = PARA_PATTERN.split(text)

        if len(splits) > 1:
            # splits: [before_first, para_no, para_text, para_no, para_text, ...]
            # index 0: 문단 번호 이전 텍스트 (헤더 등)
            i = 1
            while i < len(splits) - 1:
                para_no = splits[i]
                para_text = splits[i + 1].strip()
                para_text = re.sub(r'\s+', ' ', para_text)
                if len(para_text) >= MIN_TEXT_LEN:
                    rows.append({
                        "manual_id": manual_id,
                        "manual_number": manual_number,
                        "manual_title": manual_title,
                        "page": page_num,
                        "paragraph_no": para_no,
                        "text_en": para_text,
                    })
                i += 2
        else:
            # 번호 없는 페이지: 텍스트 블록 단위로 분리
            blocks = text.split('\n\n')
            for block in blocks:
                block = re.sub(r'\s+', ' ', block).strip()
                if len(block) >= MIN_TEXT_LEN:
                    rows.append({
                        "manual_id": manual_id,
                        "manual_number": manual_number,
                        "manual_title": manual_title,
                        "page": page_num,
                        "paragraph_no": None,
                        "text_en": block,
                    })
    doc.close()
    return rows


def process_manual(manual_id, manual_number, manual_title, supabase):
    url = f"{STORAGE_BASE}/{manual_id}.pdf"
    print(f"  다운로드 중: {url}")

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            pdf_bytes = resp.read()
    except Exception as e:
        print(f"  ❌ 다운로드 실패: {e}")
        return 0

    print(f"  파싱 중... ({len(pdf_bytes)//1024}KB)")
    rows = extract_paragraphs(pdf_bytes, manual_id, manual_number, manual_title)
    print(f"  문단 {len(rows)}개 추출")

    if not rows:
        return 0

    # 기존 데이터 삭제 후 재삽입
    supabase.table("paragraphs").delete().eq("manual_id", manual_id).execute()

    # 100개 단위로 배치 삽입
    batch_size = 100
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        supabase.table("paragraphs").insert(batch).execute()

    return len(rows)


def main():
    # 특정 교범만 처리하려면 인자로 전달: python3 extract_paragraphs.py adp-3-0
    target = sys.argv[1] if len(sys.argv) > 1 else None

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    total = 0

    for manual_id, manual_number, manual_title in MANUALS:
        if target and manual_id != target:
            continue
        print(f"\n[{manual_number}] {manual_title}")
        count = process_manual(manual_id, manual_number, manual_title, sb)
        total += count
        time.sleep(0.3)  # API 부하 방지

    print(f"\n✅ 완료! 총 {total}개 문단 저장됨")


if __name__ == "__main__":
    main()
