-- ============================================================
-- MILMAN - paragraphs 테이블
-- Supabase Dashboard > SQL Editor 에서 실행
-- ============================================================

CREATE TABLE IF NOT EXISTS paragraphs (
  id          BIGSERIAL PRIMARY KEY,
  manual_id   TEXT NOT NULL,       -- 'fm-3-0', 'adp-1' 등
  manual_number TEXT NOT NULL,     -- 'FM 3-0', 'ADP 1' 등
  manual_title  TEXT NOT NULL,
  page        INTEGER NOT NULL,
  paragraph_no TEXT,               -- '1-1', '2-3' 등 (없으면 NULL)
  text_en     TEXT NOT NULL,
  text_ko     TEXT,                -- 번역 후 채움
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 검색 인덱스
CREATE INDEX IF NOT EXISTS paragraphs_manual_id_idx ON paragraphs(manual_id);
CREATE INDEX IF NOT EXISTS paragraphs_text_search_idx
  ON paragraphs USING gin(to_tsvector('english', text_en));

-- 전체 공개 읽기 허용
ALTER TABLE paragraphs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON paragraphs FOR SELECT USING (true);
CREATE POLICY "service insert" ON paragraphs FOR INSERT WITH CHECK (true);
CREATE POLICY "service update" ON paragraphs FOR UPDATE USING (true);
