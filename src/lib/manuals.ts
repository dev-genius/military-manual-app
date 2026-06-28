export type ManualEntry = {
  id: string
  title: string
  number: string
  category: string
  description: string
  url: string
}

const BASE = 'https://lsvsoleegbkoyfkelnay.supabase.co/storage/v1/object/public/manuals'

export const MANUALS: ManualEntry[] = [
  // ── ADP ──────────────────────────────────────────────────────────
  { id: 'adp-1',     number: 'ADP 1',     title: 'The Army',                             category: '기본',     description: '미 육군 기본 교범',              url: `${BASE}/adp-1.pdf` },
  { id: 'adp-1-01',  number: 'ADP 1-01',  title: 'Doctrine Primer',                      category: '기본',     description: '미 육군 교리 입문서',            url: `${BASE}/adp-1-01.pdf` },
  { id: 'adp-2-0',   number: 'ADP 2-0',   title: 'Intelligence',                         category: '정보',     description: '미 육군 정보 교범',              url: `${BASE}/adp-2-0.pdf` },
  { id: 'adp-3-0',   number: 'ADP 3-0',   title: 'Operations',                           category: '작전',     description: '미 육군 작전 기본 교범',         url: `${BASE}/adp-3-0.pdf` },
  { id: 'adp-3-05',  number: 'ADP 3-05',  title: 'Army Special Operations',              category: '특수작전', description: '미 육군 특수작전 교범',          url: `${BASE}/adp-3-05.pdf` },
  { id: 'adp-3-07',  number: 'ADP 3-07',  title: 'Stability',                            category: '작전',     description: '안정화 작전 교범',               url: `${BASE}/adp-3-07.pdf` },
  { id: 'adp-3-13',  number: 'ADP 3-13',  title: 'Information',                          category: '정보',     description: '정보 작전 교범',                 url: `${BASE}/adp-3-13.pdf` },
  { id: 'adp-3-19',  number: 'ADP 3-19',  title: 'Fires',                                category: '화력',     description: '화력 운용 교범',                 url: `${BASE}/adp-3-19.pdf` },
  { id: 'adp-3-28',  number: 'ADP 3-28',  title: 'Defense Support of Civil Authorities', category: '작전',     description: '민간기관 지원 교범',             url: `${BASE}/adp-3-28.pdf` },
  { id: 'adp-3-37',  number: 'ADP 3-37',  title: 'Protection',                           category: '작전',     description: '부대보호 교범',                  url: `${BASE}/adp-3-37.pdf` },
  { id: 'adp-3-90',  number: 'ADP 3-90',  title: 'Offense and Defense',                  category: '작전',     description: '공격 및 방어 작전 교범',         url: `${BASE}/adp-3-90.pdf` },
  { id: 'adp-5-0',   number: 'ADP 5-0',   title: 'The Operations Process',               category: '작전',     description: '작전 프로세스 교범',             url: `${BASE}/adp-5-0.pdf` },

  // ── FM ───────────────────────────────────────────────────────────
  { id: 'fm-1',       number: 'FM 1',       title: 'The Army: A Primer to Our Profession of Arms', category: '기본',     description: '미 육군 전문직 입문서',    url: `${BASE}/fm-1.pdf` },
  { id: 'fm-1-02-1',  number: 'FM 1-02.1',  title: 'Operational Terms',                            category: '기본',     description: '작전 용어 교범',           url: `${BASE}/fm-1-02-1.pdf` },
  { id: 'fm-1-02-2',  number: 'FM 1-02.2',  title: 'Military Symbols',                             category: '기본',     description: '군사 도식 교범',           url: `${BASE}/fm-1-02-2.pdf` },
  { id: 'fm-2-0',     number: 'FM 2-0',     title: 'Intelligence',                                 category: '정보',     description: '정보 작전 교범',           url: `${BASE}/fm-2-0.pdf` },
  { id: 'fm-2-22-3',  number: 'FM 2-22.3',  title: 'Human Intelligence Collector Operations',      category: '정보',     description: '인간정보 수집 작전 교범', url: `${BASE}/fm-2-22-3.pdf` },
  { id: 'fm-3-0',     number: 'FM 3-0',     title: 'Operations',                                   category: '작전',     description: '미 육군 작전 교범',        url: `${BASE}/fm-3-0.pdf` },
  { id: 'fm-3-01',    number: 'FM 3-01',    title: 'U.S. Army Air and Missile Defense',            category: '방공',     description: '대공 및 미사일 방어 교범', url: `${BASE}/fm-3-01.pdf` },
  { id: 'fm-3-01-44', number: 'FM 3-01.44', title: 'Short-Range Air Defense Operations',           category: '방공',     description: '단거리 방공 작전 교범',    url: `${BASE}/fm-3-01-44.pdf` },
  { id: 'fm-3-04',    number: 'FM 3-04',    title: 'Army Aviation',                                category: '항공',     description: '육군 항공 교범',           url: `${BASE}/fm-3-04.pdf` },
  { id: 'fm-3-05',    number: 'FM 3-05',    title: 'Army Special Operations',                      category: '특수작전', description: '특수작전 교범',            url: `${BASE}/fm-3-05.pdf` },
  { id: 'fm-3-07',    number: 'FM 3-07',    title: 'Stability',                                    category: '작전',     description: '안정화 작전 교범',         url: `${BASE}/fm-3-07.pdf` },
  { id: 'fm-3-90',    number: 'FM 3-90',    title: 'Tactics',                                      category: '작전',     description: '전술 교범',                url: `${BASE}/fm-3-90.pdf` },
  { id: 'fm-3-96',    number: 'FM 3-96',    title: 'Brigade Combat Team',                          category: '작전',     description: '여단전투단 교범',          url: `${BASE}/fm-3-96.pdf` },
  { id: 'fm-5-0',     number: 'FM 5-0',     title: 'Planning and Orders Production',               category: '작전',     description: '계획 및 명령 생산 교범',   url: `${BASE}/fm-5-0.pdf` },
  { id: 'fm-6-0',     number: 'FM 6-0',     title: 'Commander and Staff Organization',             category: '지휘',     description: '지휘관 및 참모 조직 교범', url: `${BASE}/fm-6-0.pdf` },
]

export const CATEGORIES = ['전체', '작전', '기본', '정보', '화력', '지휘', '방공', '항공', '특수작전']
