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
  { id: 'adp-1',     number: 'ADP 1',     title: 'The Army',                              category: '기본',   description: '미 육군 기본 교범',                        url: `${BASE}/adp-1.pdf` },
  { id: 'adp-1-01',  number: 'ADP 1-01',  title: 'Doctrine Primer',                       category: '기본',   description: '미 육군 교리 입문서',                      url: `${BASE}/adp-1-01.pdf` },
  { id: 'adp-2-0',   number: 'ADP 2-0',   title: 'Intelligence',                          category: '정보',   description: '미 육군 정보 교범',                        url: `${BASE}/adp-2-0.pdf` },
  { id: 'adp-3-0',   number: 'ADP 3-0',   title: 'Operations',                            category: '작전',   description: '미 육군 작전 기본 교범',                   url: `${BASE}/adp-3-0.pdf` },
  { id: 'adp-3-05',  number: 'ADP 3-05',  title: 'Army Special Operations',               category: '특수작전', description: '미 육군 특수작전 교범',                  url: `${BASE}/adp-3-05.pdf` },
  { id: 'adp-3-07',  number: 'ADP 3-07',  title: 'Stability',                             category: '작전',   description: '안정화 작전 교범',                         url: `${BASE}/adp-3-07.pdf` },
  { id: 'adp-3-13',  number: 'ADP 3-13',  title: 'Information',                           category: '정보',   description: '정보 작전 교범',                           url: `${BASE}/adp-3-13.pdf` },
  { id: 'adp-3-19',  number: 'ADP 3-19',  title: 'Fires',                                 category: '화력',   description: '화력 운용 교범',                           url: `${BASE}/adp-3-19.pdf` },
  { id: 'adp-3-28',  number: 'ADP 3-28',  title: 'Defense Support of Civil Authorities',  category: '작전',   description: '민간기관 지원 교범',                       url: `${BASE}/adp-3-28.pdf` },
  { id: 'adp-3-37',  number: 'ADP 3-37',  title: 'Protection',                            category: '작전',   description: '부대보호 교범',                            url: `${BASE}/adp-3-37.pdf` },
  { id: 'adp-3-90',  number: 'ADP 3-90',  title: 'Offense and Defense',                   category: '작전',   description: '공격 및 방어 작전 교범',                   url: `${BASE}/adp-3-90.pdf` },
  { id: 'adp-4-0',   number: 'ADP 4-0',   title: 'Sustainment',                           category: '병참',   description: '지속지원 교범',                            url: `${BASE}/adp-4-0.pdf` },
  { id: 'adp-5-0',   number: 'ADP 5-0',   title: 'The Operations Process',                category: '작전',   description: '작전 프로세스 교범',                       url: `${BASE}/adp-5-0.pdf` },
  { id: 'adp-6-0',   number: 'ADP 6-0',   title: 'Mission Command',                       category: '지휘',   description: '임무형 지휘 교범',                         url: `${BASE}/adp-6-0.pdf` },
  { id: 'adp-6-22',  number: 'ADP 6-22',  title: 'Army Leadership and the Profession',    category: '리더십', description: '미 육군 리더십 및 전문성 교범',             url: `${BASE}/adp-6-22.pdf` },
  { id: 'adp-7-0',   number: 'ADP 7-0',   title: 'Training',                              category: '훈련',   description: '훈련 교범',                                url: `${BASE}/adp-7-0.pdf` },

  // ── FM ───────────────────────────────────────────────────────────
  { id: 'fm-1',       number: 'FM 1',       title: 'The Army: A Primer to Our Profession of Arms', category: '기본',   description: '미 육군 전문직 입문서',           url: `${BASE}/fm-1.pdf` },
  { id: 'fm-1-02-1',  number: 'FM 1-02.1',  title: 'Operational Terms',                            category: '기본',   description: '작전 용어 교범',                  url: `${BASE}/fm-1-02-1.pdf` },
  { id: 'fm-1-02-2',  number: 'FM 1-02.2',  title: 'Military Symbols',                             category: '기본',   description: '군사 도식 교범',                  url: `${BASE}/fm-1-02-2.pdf` },
  { id: 'fm-2-0',     number: 'FM 2-0',     title: 'Intelligence',                                 category: '정보',   description: '정보 작전 교범',                  url: `${BASE}/fm-2-0.pdf` },
  { id: 'fm-2-22-3',  number: 'FM 2-22.3',  title: 'Human Intelligence Collector Operations',      category: '정보',   description: '인간정보 수집 작전 교범',         url: `${BASE}/fm-2-22-3.pdf` },
  { id: 'fm-3-0',     number: 'FM 3-0',     title: 'Operations',                                   category: '작전',   description: '미 육군 작전 교범',               url: `${BASE}/fm-3-0.pdf` },
  { id: 'fm-3-01',    number: 'FM 3-01',    title: 'U.S. Army Air and Missile Defense',            category: '방공',   description: '대공 및 미사일 방어 교범',        url: `${BASE}/fm-3-01.pdf` },
  { id: 'fm-3-01-44', number: 'FM 3-01.44', title: 'Short-Range Air Defense Operations',           category: '방공',   description: '단거리 방공 작전 교범',           url: `${BASE}/fm-3-01-44.pdf` },
  { id: 'fm-3-04',    number: 'FM 3-04',    title: 'Army Aviation',                                category: '항공',   description: '육군 항공 교범',                  url: `${BASE}/fm-3-04.pdf` },
  { id: 'fm-3-05',    number: 'FM 3-05',    title: 'Army Special Operations',                      category: '특수작전', description: '특수작전 교범',                url: `${BASE}/fm-3-05.pdf` },
  { id: 'fm-3-07',    number: 'FM 3-07',    title: 'Stability',                                    category: '작전',   description: '안정화 작전 교범',                url: `${BASE}/fm-3-07.pdf` },
  { id: 'fm-3-09',    number: 'FM 3-09',    title: 'Fire Support and Field Artillery',             category: '화력',   description: '화력지원 및 야전포병 교범',       url: `${BASE}/fm-3-09.pdf` },
  { id: 'fm-3-11',    number: 'FM 3-11',    title: 'CBRN Operations',                              category: 'CBRN',   description: '화생방 작전 교범',                url: `${BASE}/fm-3-11.pdf` },
  { id: 'fm-3-12',    number: 'FM 3-12',    title: 'Cyberspace and EW Operations',                 category: '사이버', description: '사이버 및 전자전 교범',           url: `${BASE}/fm-3-12.pdf` },
  { id: 'fm-3-14',    number: 'FM 3-14',    title: 'Army Space Operations',                        category: '우주',   description: '우주 작전 교범',                  url: `${BASE}/fm-3-14.pdf` },
  { id: 'fm-3-16',    number: 'FM 3-16',    title: 'Army in Multinational Operations',             category: '작전',   description: '다국적 작전 교범',                url: `${BASE}/fm-3-16.pdf` },
  { id: 'fm-3-22',    number: 'FM 3-22',    title: 'Army Support to Security Cooperation',        category: '작전',   description: '안보협력 지원 교범',              url: `${BASE}/fm-3-22.pdf` },
  { id: 'fm-3-27',    number: 'FM 3-27',    title: 'Army Global Missile Defense',                  category: '방공',   description: '지구적 미사일 방어 교범',         url: `${BASE}/fm-3-27.pdf` },
  { id: 'fm-3-34',    number: 'FM 3-34',    title: 'Engineer Operations',                          category: '공병',   description: '공병 작전 교범',                  url: `${BASE}/fm-3-34.pdf` },
  { id: 'fm-3-39',    number: 'FM 3-39',    title: 'Military Police Operations',                   category: '헌병',   description: '헌병 작전 교범',                  url: `${BASE}/fm-3-39.pdf` },
  { id: 'fm-3-52',    number: 'FM 3-52',    title: 'Airspace Control',                             category: '항공',   description: '공역 통제 교범',                  url: `${BASE}/fm-3-52.pdf` },
  { id: 'fm-3-57',    number: 'FM 3-57',    title: 'Civil Affairs Operations',                     category: '민사',   description: '민사 작전 교범',                  url: `${BASE}/fm-3-57.pdf` },
  { id: 'fm-3-60',    number: 'FM 3-60',    title: 'Army Targeting',                               category: '화력',   description: '목표처리 교범',                   url: `${BASE}/fm-3-60.pdf` },
  { id: 'fm-3-61',    number: 'FM 3-61',    title: 'Communication Strategy and Public Affairs',    category: '공보',   description: '공보 교범',                       url: `${BASE}/fm-3-61.pdf` },
  { id: 'fm-3-63',    number: 'FM 3-63',    title: 'Detainee Operations',                          category: '작전',   description: '피억류자 작전 교범',              url: `${BASE}/fm-3-63.pdf` },
  { id: 'fm-3-81',    number: 'FM 3-81',    title: 'Maneuver Enhancement Brigade',                 category: '작전',   description: '기동증원여단 교범',               url: `${BASE}/fm-3-81.pdf` },
  { id: 'fm-3-83',    number: 'FM 3-83',    title: 'Religious Affairs',                            category: '기타',   description: '군종 교범',                       url: `${BASE}/fm-3-83.pdf` },
  { id: 'fm-3-84',    number: 'FM 3-84',    title: 'Legal Support to Operations',                  category: '기타',   description: '법무 지원 교범',                  url: `${BASE}/fm-3-84.pdf` },
  { id: 'fm-3-90',    number: 'FM 3-90',    title: 'Tactics',                                      category: '작전',   description: '전술 교범',                       url: `${BASE}/fm-3-90.pdf` },
  { id: 'fm-3-94',    number: 'FM 3-94',    title: 'Armies, Corps, and Division Operations',       category: '작전',   description: '야전군·군단·사단 작전 교범',      url: `${BASE}/fm-3-94.pdf` },
  { id: 'fm-3-96',    number: 'FM 3-96',    title: 'Brigade Combat Team',                          category: '작전',   description: '여단전투단 교범',                 url: `${BASE}/fm-3-96.pdf` },
  { id: 'fm-3-98',    number: 'FM 3-98',    title: 'Reconnaissance and Security Operations',       category: '작전',   description: '수색 및 경계 작전 교범',          url: `${BASE}/fm-3-98.pdf` },
  { id: 'fm-3-99',    number: 'FM 3-99',    title: 'Airborne and Air Assault Operations',          category: '공중강습', description: '공수 및 공중강습 작전 교범',    url: `${BASE}/fm-3-99.pdf` },
  { id: 'fm-4-0',     number: 'FM 4-0',     title: 'Sustainment Operations',                       category: '병참',   description: '지속지원 작전 교범',              url: `${BASE}/fm-4-0.pdf` },
  { id: 'fm-4-02',    number: 'FM 4-02',    title: 'Army Health System',                           category: '의무',   description: '의무 체계 교범',                  url: `${BASE}/fm-4-02.pdf` },
  { id: 'fm-4-80',    number: 'FM 4-80',    title: 'Financial Management Operations',              category: '병참',   description: '재정관리 작전 교범',              url: `${BASE}/fm-4-80.pdf` },
  { id: 'fm-5-0',     number: 'FM 5-0',     title: 'Planning and Orders Production',               category: '작전',   description: '계획 및 명령 생산 교범',          url: `${BASE}/fm-5-0.pdf` },
  { id: 'fm-6-0',     number: 'FM 6-0',     title: 'Commander and Staff Organization',             category: '지휘',   description: '지휘관 및 참모 조직 교범',        url: `${BASE}/fm-6-0.pdf` },
  { id: 'fm-6-02',    number: 'FM 6-02',    title: 'Signal Support to Operations',                 category: '통신',   description: '통신 지원 교범',                  url: `${BASE}/fm-6-02.pdf` },
  { id: 'fm-6-22',    number: 'FM 6-22',    title: 'Developing Leaders',                           category: '리더십', description: '리더 육성 교범',                  url: `${BASE}/fm-6-22.pdf` },
  { id: 'fm-6-27',    number: 'FM 6-27',    title: "Commander's Handbook on Law of Land Warfare",  category: '기타',   description: '전쟁법 핸드북',                   url: `${BASE}/fm-6-27.pdf` },
  { id: 'fm-6-99',    number: 'FM 6-99',    title: 'U.S. Army Report and Message Formats',         category: '기본',   description: '보고서 및 통신문 양식 교범',      url: `${BASE}/fm-6-99.pdf` },
  { id: 'fm-7-0',     number: 'FM 7-0',     title: 'Training',                                     category: '훈련',   description: '훈련 교범',                       url: `${BASE}/fm-7-0.pdf` },
  { id: 'fm-7-22',    number: 'FM 7-22',    title: 'Holistic Health and Fitness',                  category: '훈련',   description: '전인적 건강 및 체력 교범',        url: `${BASE}/fm-7-22.pdf` },
]

export const CATEGORIES = ['전체', '작전', '기본', '정보', '화력', '병참', '리더십', '지휘', '훈련', '항공', '공병', '방공', '통신', '의무', '민사', '헌병', '특수작전', '사이버', '우주', '공중강습', 'CBRN', '공보', '기타']
