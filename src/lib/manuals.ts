export type ManualEntry = {
  id: string
  title: string
  number: string
  category: string
  description: string
  url: string
}

const BASE = 'https://armypubs.army.mil'

export const MANUALS: ManualEntry[] = [
  // ── ADP ──────────────────────────────────────────────────────────
  { id: 'adp-1',     number: 'ADP 1',     title: 'The Army',                              category: '기본',   description: '미 육군 기본 교범',                        url: `${BASE}/epubs/DR_pubs/DR_a/ARN18008-ADP_1-000-WEB-2.pdf` },
  { id: 'adp-1-01',  number: 'ADP 1-01',  title: 'Doctrine Primer',                       category: '기본',   description: '미 육군 교리 입문서',                      url: `${BASE}/epubs/DR_pubs/DR_a/pdf/web/ARN18138_ADP 1-01 FINAL WEB.pdf` },
  { id: 'adp-2-0',   number: 'ADP 2-0',   title: 'Intelligence',                          category: '정보',   description: '미 육군 정보 교범',                        url: `${BASE}/epubs/DR_pubs/DR_a/ARN18009-ADP_2-0-000-WEB-2.pdf` },
  { id: 'adp-3-0',   number: 'ADP 3-0',   title: 'Operations',                            category: '작전',   description: '미 육군 작전 기본 교범',                   url: `${BASE}/epubs/DR_pubs/DR_a/ARN43323-ADP_3-0-000-WEB-1.pdf` },
  { id: 'adp-3-05',  number: 'ADP 3-05',  title: 'Army Special Operations',               category: '특수작전', description: '미 육군 특수작전 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/pdf/web/ARN18909_ADP 3-05 C1 FINAL WEB(2).pdf` },
  { id: 'adp-3-07',  number: 'ADP 3-07',  title: 'Stability',                             category: '작전',   description: '안정화 작전 교범',                         url: `${BASE}/epubs/DR_pubs/DR_a/pdf/web/ARN18011_ADP 3-07 FINAL WEB.pdf` },
  { id: 'adp-3-13',  number: 'ADP 3-13',  title: 'Information',                           category: '정보',   description: '정보 작전 교범',                           url: `${BASE}/epubs/DR_pubs/DR_a/ARN39736-ADP_3-13-000-WEB-1.pdf` },
  { id: 'adp-3-19',  number: 'ADP 3-19',  title: 'Fires',                                 category: '화력',   description: '화력 운용 교범',                           url: `${BASE}/epubs/DR_pubs/DR_a/pdf/web/ARN18615_ADP 3-19 FINAL WEB.pdf` },
  { id: 'adp-3-28',  number: 'ADP 3-28',  title: 'Defense Support of Civil Authorities',  category: '작전',   description: '민간기관 지원 교범',                       url: `${BASE}/epubs/DR_pubs/DR_a/pdf/web/ARN19349_ADP 3-28 FINAL WEB.pdf` },
  { id: 'adp-3-37',  number: 'ADP 3-37',  title: 'Protection',                            category: '작전',   description: '부대보호 교범',                            url: `${BASE}/epubs/DR_pubs/DR_a/ARN46285-ADP_3-37-000-WEB-2.pdf` },
  { id: 'adp-3-90',  number: 'ADP 3-90',  title: 'Offense and Defense',                   category: '작전',   description: '공격 및 방어 작전 교범',                   url: `${BASE}/epubs/DR_pubs/DR_a/ARN34828-ADP_3-90-000-WEB-1.pdf` },
  { id: 'adp-4-0',   number: 'ADP 4-0',   title: 'Sustainment',                           category: '병참',   description: '지속지원 교범',                            url: `${BASE}/epubs/DR_pubs/DR_a/ARN45863-ADP_4-0-000-WEB-1.pdf` },
  { id: 'adp-5-0',   number: 'ADP 5-0',   title: 'The Operations Process',                category: '작전',   description: '작전 프로세스 교범',                       url: `${BASE}/epubs/DR_pubs/DR_a/pdf/web/ARN18012_ADP 5-0 FINAL WEB.pdf` },
  { id: 'adp-6-0',   number: 'ADP 6-0',   title: 'Mission Command',                       category: '지휘',   description: '임무형 지휘 교범',                         url: `${BASE}/epubs/DR_pubs/DR_a/pdf/web/ARN18013_ADP 6-0 FINAL WEB.pdf` },
  { id: 'adp-6-22',  number: 'ADP 6-22',  title: 'Army Leadership and the Profession',    category: '리더십', description: '미 육군 리더십 및 전문성 교범',             url: `${BASE}/epubs/DR_pubs/DR_a/ARN20039-ADP_6-22-001-WEB-3.pdf` },
  { id: 'adp-7-0',   number: 'ADP 7-0',   title: 'Training',                              category: '훈련',   description: '훈련 교범',                                url: `${BASE}/epubs/DR_pubs/DR_a/ARN40951-ADP_7-0-000-WEB-1.pdf` },

  // ── FM ───────────────────────────────────────────────────────────
  { id: 'fm-1',       number: 'FM 1',       title: 'The Army: A Primer to Our Profession of Arms', category: '기본',   description: '미 육군 전문직 입문서',           url: `${BASE}/epubs/DR_pubs/DR_a/ARN43687-FM_1-000-WEB-2.pdf` },
  { id: 'fm-1-02-1',  number: 'FM 1-02.1',  title: 'Operational Terms',                            category: '기본',   description: '작전 용어 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN46659-FM_1-02.1-000-WEB-1.pdf` },
  { id: 'fm-1-02-2',  number: 'FM 1-02.2',  title: 'Military Symbols',                             category: '기본',   description: '군사 도식 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN44621-FM_1-02.2-001-WEB-3.pdf` },
  { id: 'fm-2-0',     number: 'FM 2-0',     title: 'Intelligence',                                 category: '정보',   description: '정보 작전 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN39259-FM_2-0-000-WEB-2.pdf` },
  { id: 'fm-2-22-3',  number: 'FM 2-22.3',  title: 'Human Intelligence Collector Operations',      category: '정보',   description: '인간정보 수집 작전 교범',         url: `${BASE}/epubs/DR_pubs/DR_a/ARN43392-FM_2-22.3-001-WEB-4.pdf` },
  { id: 'fm-3-0',     number: 'FM 3-0',     title: 'Operations',                                   category: '작전',   description: '미 육군 작전 교범',               url: `${BASE}/epubs/DR_pubs/DR_a/ARN43326-FM_3-0-000-WEB-1.pdf` },
  { id: 'fm-3-01',    number: 'FM 3-01',    title: 'U.S. Army Air and Missile Defense',            category: '방공',   description: '대공 및 미사일 방어 교범',        url: `${BASE}/epubs/DR_pubs/DR_a/ARN44767-FM_3-01-000-WEB-1.pdf` },
  { id: 'fm-3-01-44', number: 'FM 3-01.44', title: 'Short-Range Air Defense Operations',           category: '방공',   description: '단거리 방공 작전 교범',           url: `${BASE}/epubs/DR_pubs/DR_a/ARN35838-FM_3-01.44-000-WEB-1.pdf` },
  { id: 'fm-3-04',    number: 'FM 3-04',    title: 'Army Aviation',                                category: '항공',   description: '육군 항공 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN43343-FM_3-04-000-WEB-1.pdf` },
  { id: 'fm-3-05',    number: 'FM 3-05',    title: 'Army Special Operations',                      category: '특수작전', description: '특수작전 교범',                url: `${BASE}/epubs/DR_pubs/DR_a/ARN44116-FM_3-05-000-WEB-1.pdf` },
  { id: 'fm-3-07',    number: 'FM 3-07',    title: 'Stability',                                    category: '작전',   description: '안정화 작전 교범',                url: `${BASE}/epubs/DR_pubs/DR_a/NOCASE-FM_3-07-000-WEB-0.pdf` },
  { id: 'fm-3-09',    number: 'FM 3-09',    title: 'Fire Support and Field Artillery',             category: '화력',   description: '화력지원 및 야전포병 교범',       url: `${BASE}/epubs/DR_pubs/DR_a/ARN41234-FM_3-09-000-WEB-1.pdf` },
  { id: 'fm-3-11',    number: 'FM 3-11',    title: 'CBRN Operations',                              category: 'CBRN',   description: '화생방 작전 교범',                url: `${BASE}/epubs/DR_pubs/DR_a/ARN43369-FM_3-11-000-WEB-1.pdf` },
  { id: 'fm-3-12',    number: 'FM 3-12',    title: 'Cyberspace and EW Operations',                 category: '사이버', description: '사이버 및 전자전 교범',           url: `${BASE}/epubs/DR_pubs/DR_a/ARN44955-FM_3-12-000-WEB-1.pdf` },
  { id: 'fm-3-14',    number: 'FM 3-14',    title: 'Army Space Operations',                        category: '우주',   description: '우주 작전 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN45804-FM_3-14-000-WEB-1.pdf` },
  { id: 'fm-3-16',    number: 'FM 3-16',    title: 'Army in Multinational Operations',             category: '작전',   description: '다국적 작전 교범',                url: `${BASE}/epubs/DR_pubs/DR_a/ARN40998-FM_3-16-000-WEB-1.pdf` },
  { id: 'fm-3-22',    number: 'FM 3-22',    title: 'Army Support to Security Cooperation',        category: '작전',   description: '안보협력 지원 교범',              url: `${BASE}/epubs/DR_pubs/DR_a/ARN38035-FM_3-22-000-WEB-1.pdf` },
  { id: 'fm-3-27',    number: 'FM 3-27',    title: 'Army Global Missile Defense',                  category: '방공',   description: '지구적 미사일 방어 교범',         url: `${BASE}/epubs/DR_pubs/DR_a/ARN38282-FM_3-27-000-WEB-1.pdf` },
  { id: 'fm-3-34',    number: 'FM 3-34',    title: 'Engineer Operations',                          category: '공병',   description: '공병 작전 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN45484-FM_3-34-000-WEB-1.pdf` },
  { id: 'fm-3-39',    number: 'FM 3-39',    title: 'Military Police Operations',                   category: '헌병',   description: '헌병 작전 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN43413-FM_3-39-000-WEB-1.pdf` },
  { id: 'fm-3-52',    number: 'FM 3-52',    title: 'Airspace Control',                             category: '항공',   description: '공역 통제 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN34015-FM_3-52-000-WEB-1.pdf` },
  { id: 'fm-3-57',    number: 'FM 3-57',    title: 'Civil Affairs Operations',                     category: '민사',   description: '민사 작전 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN33818-FM_3-57-000-WEB-1.pdf` },
  { id: 'fm-3-60',    number: 'FM 3-60',    title: 'Army Targeting',                               category: '화력',   description: '목표처리 교범',                   url: `${BASE}/epubs/DR_pubs/DR_a/ARN38285-FM_3-60-000-WEB-1.pdf` },
  { id: 'fm-3-61',    number: 'FM 3-61',    title: 'Communication Strategy and Public Affairs',    category: '공보',   description: '공보 교범',                       url: `${BASE}/epubs/DR_pubs/DR_a/ARN36531-FM_3-61-000-WEB-1.pdf` },
  { id: 'fm-3-63',    number: 'FM 3-63',    title: 'Detainee Operations',                          category: '작전',   description: '피억류자 작전 교범',              url: `${BASE}/epubs/DR_pubs/DR_a/ARN45817-FM_3-63-000-WEB-1.pdf` },
  { id: 'fm-3-81',    number: 'FM 3-81',    title: 'Maneuver Enhancement Brigade',                 category: '작전',   description: '기동증원여단 교범',               url: `${BASE}/epubs/DR_pubs/DR_a/ARN35546-FM_3-81-000-WEB-1.pdf` },
  { id: 'fm-3-83',    number: 'FM 3-83',    title: 'Religious Affairs',                            category: '기타',   description: '군종 교범',                       url: `${BASE}/epubs/DR_pubs/DR_a/ARN43369-FM_3-83-000-WEB-1.pdf` },
  { id: 'fm-3-84',    number: 'FM 3-84',    title: 'Legal Support to Operations',                  category: '기타',   description: '법무 지원 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN38338-FM_3-84-000-WEB-1.pdf` },
  { id: 'fm-3-90',    number: 'FM 3-90',    title: 'Tactics',                                      category: '작전',   description: '전술 교범',                       url: `${BASE}/epubs/DR_pubs/DR_a/ARN37571-FM_3-90-000-WEB-1.pdf` },
  { id: 'fm-3-94',    number: 'FM 3-94',    title: 'Armies, Corps, and Division Operations',       category: '작전',   description: '야전군·군단·사단 작전 교범',      url: `${BASE}/epubs/DR_pubs/DR_a/ARN33547-FM_3-94-000-WEB-1.pdf` },
  { id: 'fm-3-96',    number: 'FM 3-96',    title: 'Brigade Combat Team',                          category: '작전',   description: '여단전투단 교범',                 url: `${BASE}/epubs/DR_pubs/DR_a/ARN31692-FM_3-96-000-WEB-1.pdf` },
  { id: 'fm-3-98',    number: 'FM 3-98',    title: 'Reconnaissance and Security Operations',       category: '작전',   description: '수색 및 경계 작전 교범',          url: `${BASE}/epubs/DR_pubs/DR_a/ARN37146-FM_3-98-000-WEB-1.pdf` },
  { id: 'fm-3-99',    number: 'FM 3-99',    title: 'Airborne and Air Assault Operations',          category: '공중강습', description: '공수 및 공중강습 작전 교범',    url: `${BASE}/epubs/DR_pubs/DR_a/ARN43476-FM_3-99-000-WEB-1.pdf` },
  { id: 'fm-4-0',     number: 'FM 4-0',     title: 'Sustainment Operations',                       category: '병참',   description: '지속지원 작전 교범',              url: `${BASE}/epubs/DR_pubs/DR_a/ARN45862-FM_4-0-000-WEB-1.pdf` },
  { id: 'fm-4-02',    number: 'FM 4-02',    title: 'Army Health System',                           category: '의무',   description: '의무 체계 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN32286-FM_4-02-000-WEB-1.pdf` },
  { id: 'fm-4-80',    number: 'FM 4-80',    title: 'Financial Management Operations',              category: '병참',   description: '재정관리 작전 교범',              url: `${BASE}/epubs/DR_pubs/DR_a/ARN43407-FM_4-80-000-WEB-1.pdf` },
  { id: 'fm-5-0',     number: 'FM 5-0',     title: 'Planning and Orders Production',               category: '작전',   description: '계획 및 명령 생산 교범',          url: `${BASE}/epubs/DR_pubs/DR_a/ARN41902-FM_5-0-000-WEB-1.pdf` },
  { id: 'fm-6-0',     number: 'FM 6-0',     title: 'Commander and Staff Organization',             category: '지휘',   description: '지휘관 및 참모 조직 교범',        url: `${BASE}/epubs/DR_pubs/DR_a/ARN36054-FM_6-0-000-WEB-1.pdf` },
  { id: 'fm-6-02',    number: 'FM 6-02',    title: 'Signal Support to Operations',                 category: '통신',   description: '통신 지원 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN18206-FM_6-02-000-WEB-2.pdf` },
  { id: 'fm-6-22',    number: 'FM 6-22',    title: 'Developing Leaders',                           category: '리더십', description: '리더 육성 교범',                  url: `${BASE}/epubs/DR_pubs/DR_a/ARN36671-FM_6-22-000-WEB-1.pdf` },
  { id: 'fm-6-27',    number: 'FM 6-27',    title: "Commander's Handbook on Law of Land Warfare",  category: '기타',   description: '전쟁법 핸드북',                   url: `${BASE}/epubs/DR_pubs/DR_a/ARN18207-FM_6-27-000-WEB-2.pdf` },
  { id: 'fm-6-99',    number: 'FM 6-99',    title: 'U.S. Army Report and Message Formats',         category: '기본',   description: '보고서 및 통신문 양식 교범',      url: `${BASE}/epubs/DR_pubs/DR_a/ARN33243-FM_6-99-000-WEB-1.pdf` },
  { id: 'fm-7-0',     number: 'FM 7-0',     title: 'Training',                                     category: '훈련',   description: '훈련 교범',                       url: `${BASE}/epubs/DR_pubs/DR_a/ARN33369-FM_7-0-000-WEB-1.pdf` },
  { id: 'fm-7-22',    number: 'FM 7-22',    title: 'Holistic Health and Fitness',                  category: '훈련',   description: '전인적 건강 및 체력 교범',        url: `${BASE}/epubs/DR_pubs/DR_a/ARN30714-FM_7-22-000-WEB-2.pdf` },
]

export const CATEGORIES = ['전체', '작전', '기본', '정보', '화력', '병참', '리더십', '지휘', '훈련', '항공', '공병', '방공', '통신', '의무', '민사', '헌병', '특수작전', '사이버', '우주', '공중강습', 'CBRN', '공보', '기타']
