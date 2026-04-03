import fs from 'fs';
import { getAllVenues } from '../src/lib/venues';

function hasJong(s: string): boolean {
  const c = s.charCodeAt(s.length - 1);
  return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
}
function djb2(s: string): number { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return Math.abs(h); }
const eN = (s: string) => hasJong(s) ? '은' : '는';

const prologues = [
  (v: any) => `<p>금요일 저녁, ${v.district}의 거리가 서서히 달아오른다. ${v.name}을 향해 걸음을 옮긴다. 간판 불빛이 보이기 전부터 이미 기대감이 올라온다.${v.nickname ? ' ' + v.nickname + '에게 미리 연락해둔 덕에 입구에서 바로 안내를 받았다.' : ''}</p>`,
  (v: any) => `<p>토요일 밤 10시, 택시에서 내리자마자 ${v.district} 특유의 밤 냄새가 코를 자극한다. ${v.name}의 입구는 생각보다 소박했다. 하지만 문을 열고 들어간 순간 그 선입견은 완전히 뒤집어졌다.</p>`,
  (v: any) => `<p>${v.station ? v.station + '에서 내려 5분 정도 걸었다.' : v.district + '까지 택시로 왔다.'} ${v.name}${eN(v.name)} 골목 안쪽에 자리잡고 있었다. 아는 사람만 찾아오는 느낌. 간판보다 안쪽이 진짜라는 말이 실감난다.</p>`,
  (v: any) => `<p>비가 오는 수요일, ${v.district}은 한산했다. ${v.name}도 평소보다 여유로웠다. 덕분에 처음 온 사람치고는 꽤 편하게 분위기를 살필 수 있었다.</p>`,
  (v: any) => `<p>퇴근길, 갑자기 ${v.name}이 생각났다. 혼자 가도 괜찮을까 고민하다가 그냥 발걸음을 옮겼다. ${v.district}은 저녁 8시만 넘어가면 분위기가 확 달라진다.</p>`,
  (v: any) => `<p>${v.name}을 처음 알게 된 건 지인 추천이었다. "${v.district}에 갈 일 있으면 꼭 가봐." 반신반의하며 찾아갔는데, 돌아오는 길에 다음 방문 날짜를 잡고 있었다.</p>`,
  (v: any) => `<p>주말 저녁, ${v.district} 상권이 활기를 띠기 시작한다. ${v.name}의 영업 시작 시간에 맞춰 도착했다. 오픈 직후의 여유로움은 피크타임과는 전혀 다른 매력이 있다.</p>`,
  (v: any) => `<p>네비게이션에 ${v.name}을 입력하고 출발했다. ${v.district}까지 오는 길은 생각보다 수월했다.${v.station ? ' ' + v.station + '을 이용하면 더 편하다.' : ''} 도착해서 보니, 주변에 2차 갈 만한 곳도 많았다.</p>`,
  (v: any) => `<p>회식 장소를 ${v.name}으로 정했다. ${v.nickname ? v.nickname + '에게 미리 인원수와 예산을 말해뒀더니 딱 맞는 자리를 잡아줬다.' : '전화로 인원수를 미리 알려뒀더니 자리를 잡아줬다.'} ${v.district}에서 단체 모임 장소로 이만한 곳이 또 있을까.</p>`,
  (v: any) => `<p>${v.name}에 대한 첫 기억은 소리였다. ${v.district}의 밤거리를 걷다가 어디선가 들려오는 음악에 이끌려 발을 멈췄다. 우연한 발견이 최고의 발견이 되는 법이다.</p>`,
];

const sceneFoci = [
  '첫인상과 입구의 분위기', '음악과 사운드의 특징', '조명과 인테리어 디테일',
  '서비스 퀄리티와 응대', '드레스코드와 입장 과정', '좌석 배치와 공간 구성',
  '주류 메뉴와 가격대', '평일과 주말의 차이점', '오픈 초반의 여유로움', '주변 환경과 접근성',
];
const scene2Foci = [
  '단골이 말하는 재방문 포인트', '주변 상권과의 동선 연계', '가성비 분석과 만족도',
  '시간대별 분위기 변화', '근처 맛집과 연계 코스', '특별한 날 추천 이유',
  '교통편과 귀가 팁', '담당자와의 소통 경험', '마감 시간의 여운', '재방문 시 달라지는 경험',
];
const dTones = [
  '직장 동료끼리', '대학 친구끼리', '커플 방문기', '혼자 방문 후기', '회사 모임 후기',
  '생일 파티 후기', '주말 야근 후 방문기', '친구 추천으로 방문', '단골 3년차의 솔직 리뷰', '외지인의 첫 방문기',
];

const allV = getAllVenues();
const newSlugs = new Set<string>();

for (const v of allV) {
  try {
    const d = JSON.parse(fs.readFileSync(`src/data/venue-content/${v.slug}.json`, 'utf-8'));
    if (d.heroTagline === v.card_hook || d.heroTagline === v.name + '에서 특별한 밤을') {
      newSlugs.add(v.slug);
    }
  } catch {}
}

let updated = 0;
for (const v of allV) {
  if (!newSlugs.has(v.slug)) continue;
  const filePath = `src/data/venue-content/${v.slug}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const h1 = djb2(v.slug + ':s1f');
  const h2 = djb2(v.slug + ':s2f');
  const hd = djb2(v.slug + ':dtone');
  const hp = djb2(v.slug + ':prolog');

  const s1f = sceneFoci[h1 % sceneFoci.length];
  const s2f = scene2Foci[h2 % scene2Foci.length];
  const dt = dTones[hd % dTones.length];
  const hook = v.card_hook || v.district + '에서 손꼽히는 곳이다';
  const tag0 = (v.tags && v.tags[0]) || v.district;

  data.prologueTitle = `${v.name} — ${s1f}`;
  data.prologue = prologues[hp % prologues.length](v);
  data.scene1Title = `${v.name}: ${s1f}`;
  data.scene1 = `<p>${v.name}의 ${s1f}을 직접 경험했다. ${hook}. ${v.district}에서 이 수준의 ${s1f}을 갖춘 곳은 ${v.name}이 유일하다. ${tag0}을 중시하는 사람이라면 ${v.name}${eN(v.name)} 기대 이상일 것이다.</p>`;
  data.scene2Title = `${v.name}: ${s2f}`;
  data.scene2 = `<p>${s2f}에 대해 이야기하자면, ${v.name}${eN(v.name)} ${v.district}에서 독보적이다. ${v.keywords && v.keywords[0] ? v.keywords[0] + '을 기준으로 봤을 때 ' : ''}${v.name}${eN(v.name)} 확실히 상위권이다. 다음 방문이 기대되는 이유다.</p>`;
  data.dialogueTitle = `${dt} — ${v.name} 후기`;
  data.dialogueSection = `<p>"${v.name} 어땠어?" "${hook}이라더니 진짜였어." ${dt}의 솔직한 대화. ${v.name}${eN(v.name)} 직접 가봐야 왜 이런 말이 나오는지 안다.</p>`;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  updated++;
}
console.log(`Updated with unique angles: ${updated} files`);
