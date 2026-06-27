-- Supabase에서 실행하세요 (SQL Editor)

create table if not exists terms (
  id bigint generated always as identity primary key,
  korean text not null,
  english text not null,
  abbreviation text,
  definition_ko text,
  definition_en text,
  category text,
  created_at timestamptz default now()
);

-- 검색 성능을 위한 인덱스
create index if not exists terms_korean_idx on terms using gin (to_tsvector('simple', korean));
create index if not exists terms_english_idx on terms using gin (to_tsvector('simple', english));
create index if not exists terms_category_idx on terms (category);

-- RLS 정책 (읽기는 누구나, 쓰기는 인증된 사용자만)
alter table terms enable row level security;

create policy "Public read" on terms
  for select using (true);

create policy "Authenticated write" on terms
  for all using (true); -- 개발 단계에서는 전체 허용, 배포 시 수정 필요

-- 샘플 데이터
insert into terms (korean, english, abbreviation, definition_ko, definition_en, category) values
('작전명령', 'Operation Order', 'OPORD', '지휘관이 예하 부대에 내리는 작전 수행 명령', 'A directive issued by a commander to subordinate commanders for the purpose of effecting the coordinated execution of an operation', '작전'),
('경계명령', 'Warning Order', 'WARNORD', '다음 작전에 대한 예비 통보', 'A preliminary notice of an order or action which is to follow', '작전'),
('단편명령', 'Fragmentary Order', 'FRAGO', '기존 작전명령을 일부 변경하는 명령', 'An abbreviated form of an operation order issued as needed after an OPORD to change or modify that order', '작전'),
('화력지원', 'Fire Support', 'FS', '직사화기, 간접화기, 항공화력 등을 통한 전투지원', 'Collective and coordinated use of target acquisition data, indirect fire weapons, armed aircraft, and other lethal and nonlethal means', '화력'),
('포병지원', 'Artillery Support', 'AS', '포병 화력을 이용한 전투지원', 'Fire support provided by artillery units', '화력'),
('보급', 'Supply', 'S', '부대에 필요한 물자를 제공하는 활동', 'The activity of providing goods and materials needed by a unit', '병참'),
('정보', 'Intelligence', 'INT', '적 및 환경에 관한 정보의 수집, 처리, 분석', 'The product resulting from the collection, processing, integration, evaluation, analysis, and interpretation of available information concerning foreign nations', '정보'),
('지휘통제', 'Command and Control', 'C2', '작전 수행을 위한 지휘관의 권한 행사 및 지휘 절차', 'The exercise of authority and direction by a properly designated commander over assigned and attached forces in the accomplishment of the mission', '작전'),
('전술작전본부', 'Tactical Operations Center', 'TOC', '전술 제대의 작전 지휘 시설', 'A physical facility at which the primary functions of the command post are performed', '작전'),
('진지점령', 'Occupation of Position', 'OP', '부대가 방어 진지를 점령하는 행동', 'The act of moving into and establishing a defensive position', '작전');
