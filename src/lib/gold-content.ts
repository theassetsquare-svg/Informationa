import { Venue, SITE_URL } from './venues';

export const SITE_NAME = '놀쿨';
const YEAR = new Date().getFullYear();
const ACCENT = '#4F46E5';

/* ── djb2 해시 — 균일 분포 ── */
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* ── 독립 해시 선택 — 항목마다 개별 해시 → 조합 충돌 제거 ── */
function pick<T>(arr: T[], slug: string, count: number, offset = 0): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count; i++) {
    let idx = hash(slug + ':' + offset + ':' + i) % arr.length;
    let attempts = 0;
    while (used.has(idx) && attempts < arr.length) {
      idx = (idx + 1) % arr.length;
      attempts++;
    }
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

/* ── 한국어 조사 ── */
function hasJong(s: string): boolean {
  const c = s.charCodeAt(s.length - 1);
  return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
}
function eunNeun(s: string) { return hasJong(s) ? '은' : '는'; }
function iGa(s: string) { return hasJong(s) ? '이' : '가'; }
function eulReul(s: string) { return hasJong(s) ? '을' : '를'; }

const catLabel: Record<string, string> = {
  club: '클럽', night: '나이트', lounge: '라운지',
  room: '룸', yojeong: '요정', hoppa: '호빠',
};

/* ═══════════════════════════════════════
   태그라인 — venue.card_hook 기반 (공유 풀 없음)
   ═══════════════════════════════════════ */
function getTagline(venue: Venue, _venueIndex: number): string {
  const nameWords = venue.name.split(/\s+/).filter(w => w.length >= 2);
  function stripNameWords(text: string): string {
    let result = text;
    for (const w of nameWords) {
      result = result.replace(new RegExp(w, 'g'), '').trim();
    }
    return result.replace(/\s{2,}/g, ' ').trim();
  }

  if (venue.card_hook && venue.card_hook.length > 10) {
    const cleaned = stripNameWords(venue.card_hook).slice(0, 50);
    if (cleaned.length > 10) return cleaned.endsWith('.') ? cleaned.slice(0, -1) : cleaned;
  }
  // Fallback: venue-data 기반 생성 (공유 풀 없음)
  const label = catLabel[venue.cat_slug] || venue.category;
  const nick = venue.nickname || '담당자';
  const fallbacks = [
    `${venue.district} ${label} 중 직접 가본 사람만 추천하는 곳`,
    `${venue.district}에서 한 번 가면 단골 되는 ${label}`,
    `${venue.region}에서 현지인이 먼저 알려주는 ${label}`,
    `${venue.district}의 밤을 바꿔놓은 곳, ${nick} 문의`,
    `${venue.region}에서 이미 입소문 탄 ${label}`,
    `${venue.district} 단골들이 숨기고 싶어하는 ${label}`,
    `${nick}에게 전화 한 통이면 시작되는 ${venue.district}의 밤`,
    `${venue.district}에서 재방문율 1위, 가본 사람만 아는 이유`,
  ];
  return fallbacks[hash(venue.slug + ':tl:v9') % fallbacks.length];
}

/* ═══════════════════════════════════════
   서사 생성 — 업소별 고유 데이터 기반 (공유 풀 완전 제거)
   ═══════════════════════════════════════ */

/* ── 오프닝 훅 템플릿 (venue 데이터 직접 사용) ── */
function generateOpeningHooks(venue: Venue, label: string, loc: string, nick: string): string[] {
  const templates = [
    `${venue.name}에 들어서는 순간 분위기가 확 달라진다. ${venue.district}에서 이 정도 공간감을 가진 ${label}${eunNeun(label)} 쉽게 찾기 어렵다. ${venue.card_hook || '직접 와봐야 이해되는 종류의 경험이다.'}`,
    `${loc} 일대를 잘 아는 사람이라면 ${venue.name}${eulReul(venue.name)} 한 번쯤 들어봤을 것이다. ${nick}에게 미리 연락하면 방문이 한결 수월해진다. 현장 분위기는 글로 전달하기 어렵다.`,
    `${venue.name}${eunNeun(venue.name)} ${venue.district}에서 분위기로 이야기되는 곳이다. 문을 열고 들어가는 순간 왜 여기가 화제인지 바로 감이 온다. 공간이 만들어내는 에너지가 확실히 다르다.`,
    `${venue.district}의 밤을 알고 싶다면 ${venue.name}${eulReul(venue.name)} 빼놓을 수 없다. ${venue.card_hook || '이 동네 사람들 사이에서 이미 정평이 나 있다.'} 한번 와보면 왜 그런지 금방 알게 된다.`,
    `${venue.name}에 처음 갔을 때 솔직히 긴장했다. 근데 ${nick}${iGa(nick)} 처음부터 끝까지 안내해줘서 5분 만에 적응됐다. ${venue.district}에서 이런 응대를 받은 건 처음이었다.`,
    `${venue.region}에서 ${venue.district}까지 찾아오는 사람이 많은 데는 이유가 있다. ${venue.name}${eunNeun(venue.name)} 그 기대를 배신하지 않는 곳이다. 갔다 온 사람들 후기가 하나같이 같다.`,
    `${venue.name}${iGa(venue.name)} ${venue.district}에서 눈에 띄는 건 단순히 간판 때문이 아니다. ${venue.card_hook || '안쪽 분위기가 겉모습과 완전히 다르다.'} 직접 들어가 봐야 이해되는 공간이다.`,
    `${venue.district} 상권이 저녁이 되면 분위기가 완전히 달라진다. 그 중심에 ${venue.name}${iGa(venue.name)} 있다. ${venue.station ? venue.station + '에서 걸어오면서 이미 기대감이 올라간다.' : '도착하면 바로 분위기에 젖어든다.'}`,
    `${venue.name}${eulReul(venue.name)} 검색해서 여기까지 온 사람이라면 이미 관심이 있다는 뜻이다. ${venue.district}에서 ${label}${eulReul(label)} 찾는다면 후보군에서 빠지기 어려운 곳이다.`,
    `솔직히 ${venue.name}${eunNeun(venue.name)} 사진보다 실물이 낫다. ${venue.district}에서 이 정도 규모와 분위기를 동시에 갖춘 ${label}${eunNeun(label)} 손에 꼽는다.`,
  ];
  return pick(templates, venue.slug, 2, 1);
}

/* ── 위치/지역 맥락 템플릿 (venue 데이터 직접 사용) ── */
function generateLocationContext(venue: Venue, label: string, loc: string, nick: string): string[] {
  const paras: string[] = [];

  if (venue.station) {
    const transTemplates = [
      `${venue.station}에서 내려 걸으면 금방이다. ${loc} 일대를 처음 방문하는 사람이라면 역에서 나와 가장 가까운 출구 방향으로 5분 정도만 걸어보자. 주변 상권이 펼쳐지면서 자연스럽게 ${venue.name} 근처에 도착한다.`,
      `교통 면에서 ${venue.station}이 가장 가깝다. 주말 저녁에는 역 주변부터 사람이 몰리기 시작한다. 대중교통을 이용하면 주차 걱정 없이 ${venue.name}${eulReul(venue.name)} 편하게 즐길 수 있다.`,
      `${venue.station}을 이용하면 ${venue.name}까지 접근이 수월하다. 막차 시간을 미리 체크해두는 것이 현명하다. 새벽에 막차를 놓치면 ${venue.district}에서 택시비 부담이 만만치 않기 때문이다.`,
      `대중교통으로 올 경우 ${venue.station}이 최적이다. 역에서 나오면 ${venue.district} 특유의 분위기가 바로 느껴진다. ${venue.name}까지 네비게이션 없이도 사람의 흐름을 따라가면 자연스럽게 도착한다.`,
    ];
    paras.push(transTemplates[hash(venue.slug + ':trans:v3') % transTemplates.length]);
  }

  if (venue.region !== venue.district) {
    const regionTemplates = [
      `${venue.region} 지역에서 ${venue.district}${eunNeun(venue.district)} 밤 문화의 중심축이다. ${venue.name}${eunNeun(venue.name)} 그 중심에 자리잡고 있다. 주변 상권과 연계되어 1차부터 3차까지 자연스러운 동선이 만들어진다.`,
      `${venue.district} 상권은 저녁이 되면 분위기가 확 달라진다. ${venue.name}${eunNeun(venue.name)} 그 변화의 시작점이다. ${venue.region} 일대를 잘 아는 사람이라면 동선을 짤 때 빠뜨리지 않는 곳이다.`,
      `${venue.region}에서 ${venue.district}까지 오는 길에 맛집도 많다. 저녁 식사를 근처에서 한 뒤 ${venue.name}으로 자연스럽게 이어지는 코스를 추천한다. 밤이 깊어질수록 ${venue.district} 거리의 열기도 올라간다.`,
    ];
    paras.push(regionTemplates[hash(venue.slug + ':reg:v3') % regionTemplates.length]);
  }

  // 위치 맥락 (venue 고유 데이터 기반)
  const locTemplates = [
    `${venue.district} 일대는 저녁이 되면 분위기가 확 달라진다. ${venue.name}${eunNeun(venue.name)} 그 변화 속에서 꾸준히 자리를 지켜온 곳이다. 낮에는 조용한 상권이 밤에는 활기를 띠면서 유동 인구가 급증한다.`,
    `${venue.name} 주변에 식사할 곳이 풍부하다. ${venue.district}에서 저녁 7시쯤 근처 맛집에서 1차를 하고 자연스럽게 이어지는 동선을 만들 수 있다. ${nick}에게 물어보면 추천 맛집도 알려준다.`,
    `${venue.district}에서 ${venue.name}${eulReul(venue.name)} 찾을 때 택시를 이용할 경우 ${venue.address ? venue.address.split(' ').slice(0, 2).join(' ') + '를 말하면 된다' : '주소를 네비게이션에 정확히 입력하면 건물 앞까지 안내된다'}.`,
    `${venue.district} 상권은 시간대에 따라 성격이 변한다. 저녁 초반에는 식사 위주, 10시 이후부터는 유흥 중심으로 거리의 온도가 올라간다. ${venue.name}${eunNeun(venue.name)} 그 열기의 중심에 있다.`,
    `${venue.district}에서 ${venue.name} 근처에 편의점이 있으니 보조배터리나 생수를 미리 준비할 수 있다. 밤새 ${venue.name}에서 즐기려면 이런 사소한 준비가 체감 만족도를 높인다.`,
    `새벽 시간대에는 ${venue.district}에서 택시 잡기가 쉽지 않을 수 있다. ${venue.name}에서 나올 때를 대비해 호출 앱을 미리 설치하거나 대리운전 번호를 저장해두면 귀가가 수월하다.`,
  ];
  paras.push(locTemplates[hash(venue.slug + ':loc:v3') % locTemplates.length]);

  return paras;
}

/* ── 경험 묘사 템플릿 (venue 데이터 직접 사용) ── */
function generateExperienceParas(venue: Venue, label: string, nick: string): string[] {
  const templates = [
    `솔직히 ${venue.name}에 처음 갔을 때 좀 긴장했다. 근데 앉고 나니까 5분 만에 적응됐다. ${venue.district}에서 이 정도 분위기면 가볍게 발걸음이 또 향하게 된다.`,
    `${venue.name}${eunNeun(venue.name)} 사진보다 실물이 낫다. ${venue.district}에서 이 정도 공간을 갖춘 ${label}${eunNeun(label)} 드물다. 그래서 갔다 온 사람들이 또 간다.`,
    `${venue.name}에서 ${nick}에게 추천을 물어보면 만족도가 확 올라간다. ${venue.district}에서 오래 일한 사람이라 취향에 맞는 안내를 해준다. 이거 한 번 경험하면 다른 데서 아쉬워진다.`,
    `${venue.name}${eunNeun(venue.name)} 환기가 잘 돼서 오래 있어도 답답하지 않다. ${venue.district} ${label} 중에서 공기 관리까지 신경 쓰는 곳은 많지 않다. 이건 은근 중요한 포인트다.`,
    `같이 가는 사람이 있으면 ${venue.name}에서 어떤 자리 원하는지 미리 말해둬라. ${nick}에게 전화하면 목적에 맞는 자리를 안내받을 수 있다. 자리에 따라 느낌이 완전 다르다.`,
    `${venue.name}에 갔다 온 사람들 후기 보면 하나같이 "또 가고 싶다"다. ${venue.district}에서 이 정도 재방문 의사를 만드는 ${label}${eunNeun(label)} 흔치 않다.`,
    `기념일이면 ${venue.name}에 미리 말해봐라. ${nick}${iGa(nick)} 세팅 도와주거나 서프라이즈 준비를 안내해준다. ${venue.district}에서 이런 디테일은 보기 드물다.`,
    `${venue.name}에서 단체 모임을 하면 실패할 확률이 거의 없다. ${venue.district}에서 공간이 알아서 분위기를 만들어주는 곳이라는 평가를 받고 있다.`,
    `${venue.name}${eulReul(venue.name)} 한 번으로 판단하지 마라. 두세 번은 가봐야 진짜가 보인다. ${venue.district} 단골들이 입을 모아 하는 말이다.`,
    `${venue.name}에서 나가면서 다음에 언제 오지 생각하게 된다. ${venue.district}에서 그 정도 여운이 남는 ${label}${eunNeun(label)} 많지 않다. 억지가 아니라 진짜 그렇다.`,
  ];
  return pick(templates, venue.slug, 2, 3);
}

/* ── 시간대 추천 템플릿 (venue 데이터 직접 사용) ── */
function generateTimeRecoText(venue: Venue, label: string, nick: string): string {
  const templates = [
    `${venue.name}${eunNeun(venue.name)} 금·토요일 자정 전후가 피크타임이다. 그 전에 도착하면 ${venue.district}에서 좋은 자리를 선점할 수 있고, 분위기가 무르익는 과정을 처음부터 경험할 수 있다.`,
    `${venue.name}${eulReul(venue.name)} 주중에 방문하면 ${venue.district}의 여유로운 분위기를 만끽할 수 있다. ${nick}의 응대도 한결 세심해지고, 공간을 넉넉하게 사용할 수 있다.`,
    `${venue.name}${eunNeun(venue.name)} 토요일이 가장 붐빈다. 금요일이 사람이 조금 적어 더 편하게 즐길 수 있다. ${venue.district}에서 여유로운 밤을 원한다면 금요일을 노려보자.`,
    `${venue.name}에 오픈 직후에 방문하면 ${venue.district}의 분위기가 형성되기 전이라 차분하게 공간을 살필 수 있다. 처음이라면 이 시간대를 ${nick}에게 문의해보자.`,
    `${venue.name}${eunNeun(venue.name)} 공휴일 전날은 주말 못지않게 사람이 몰린다. ${nick}에게 미리 전화로 상황을 확인하면 헛걸음을 줄일 수 있다.`,
    `${venue.district}에서 ${venue.name}${eulReul(venue.name)} 방문할 때 이른 저녁에 출발해서 주변에서 식사한 뒤 방문하는 코스가 가장 편하다. 밤이 시작되는 시간에 맞춰 도착하면 타이밍이 완벽하다.`,
    `비 오는 날에 ${venue.name}${eulReul(venue.name)} 방문하면 평소보다 한산해서 프라이빗한 분위기를 즐길 수 있다. ${venue.district}에서 이런 여유는 날씨가 만들어준다.`,
    `${venue.name}${eunNeun(venue.name)} 새벽 2시 이후에 또 다른 분위기가 형성된다. ${venue.district}에서 남아 있는 사람들끼리 묘한 연대감이 생기는 시간대다.`,
  ];
  return templates[hash(venue.slug + ':time:v3') % templates.length];
}

/* ── 첫 방문자 팁 템플릿 (venue 데이터 직접 사용) ── */
function generateFirstTimerTip(venue: Venue, label: string, nick: string): string {
  const templates = [
    `${venue.name}${eulReul(venue.name)} 처음 방문한다면 ${nick}에게 전화 한 통 넣는 게 현명하다. ${venue.district}에서 당일 상황이랑 좌석 여부를 바로 확인할 수 있다.`,
    `${venue.name} 방문 전 신분증을 반드시 지참하자. ${venue.district} 일대 대부분의 ${label}${iGa(label)} 만 19세 이상만 입장 가능하며, 없으면 입장 자체가 불가능하다.`,
    `${venue.name}에 갈 때 보조배터리를 꼭 챙기자. ${venue.district}에서 새벽에 배터리가 방전되면 택시 호출은 물론 ${nick}에게 연락하기도 어려워진다.`,
    `${venue.name} 방문 시 복장은 깔끔하게 갖추는 것이 좋다. ${venue.district}에서 첫인상이 입장 여부를 좌우하는 곳도 있으니 슬리퍼나 운동복은 피하자.`,
    `${venue.name}에서 음주 후 운전은 절대 금물이다. ${venue.station ? venue.station + ' 대중교통이나 ' : ''}대리운전 앱을 미리 설치해두면 ${venue.district}에서 귀가가 편리하다.`,
    `${venue.name}${eulReul(venue.name)} 처음 가는 거라면 주말보다 평일을 추천한다. ${venue.district}에서 여유 있을 때 ${nick}에게 시스템 설명을 들으면 더 알차게 즐길 수 있다.`,
    `${venue.name} 방문 전 물을 충분히 마셔두면 다음 날 컨디션이 한결 낫다. ${venue.district}에서 즐기는 것만큼 회복도 중요하다.`,
    `${venue.name}에 갈 때 현금을 소액이라도 준비하자. ${venue.district}에서 카드 결제가 안 되는 서비스가 간혹 있다.`,
  ];
  return templates[hash(venue.slug + ':ft:v3') % templates.length];
}

/* ── 마무리 훅 템플릿 (venue 데이터 직접 사용) ── */
function generateClosingHook(venue: Venue, label: string, nick: string): string {
  const templates = [
    `${venue.name}${eunNeun(venue.name)} 글로 전하는 데 한계가 있다. 분위기, 소리, 조명 — 이건 ${venue.district}에서 직접 가봐야 안다. ${nick}에게 전화 한 통이면 최신 정보를 바로 확인할 수 있다.`,
    `${venue.name}에 한 번 가면 기준이 바뀐다. ${venue.district}에서 비교 대상이 사라진다. 진짜다. ${nick}에게 미리 살펴보고 가면 더 알찬 밤이 된다.`,
    `${venue.name}에 갔다 온 사람들 후기가 하나같이 같다. "또 가고 싶다." 그 이유를 ${venue.district}에서 직접 확인해봐라. ${nick}에게 연락하면 다른 ${label}이랑 비교 정보도 얻을 수 있다.`,
    `${venue.name}${eunNeun(venue.name)} 추천받고 왔으면 추천한 사람한테 고맙다고 해라. 진심으로. ${nick}(${venue.nickname_phone || '전화 문의'})에게 연락하면 더 자세한 정보를 확인할 수 있다.`,
    `${venue.name}${eulReul(venue.name)} 경험하면 ${venue.district} 밤 문화 보는 눈이 달라진다. 기준점이 생기는 거다. ${venue.region}에서 여러 ${label}${eulReul(label)} 비교해봐도 좋다.`,
    `${venue.name} 얘기했더니 관심 없던 친구가 같이 가겠다고 했다. ${venue.district}에서 그만큼 전달력 있는 경험이다. ${nick}에게 방문 전 확인 한 번이면 실패 없는 저녁이 된다.`,
    `${venue.name}에서의 밤은 사진보다 기억으로 남는 종류다. ${venue.district}에서 어떤 기억을 만들지는 가봐야 안다. ${nick}에게 문의하면 준비할 것도 안내받을 수 있다.`,
    `가기 전에 ${nick}에게 ${venue.name} 운영 시간이랑 분위기 한번 확인해둬라. 그 5분이 ${venue.district}에서 실패 없는 저녁을 만들어준다.`,
  ];
  return templates[hash(venue.slug + ':cl:v3') % templates.length];
}

/* ═══════════════════════════════════════
   서사 생성 엔진 (500+ 한국어 글자) — 공유 풀 없음
   ═══════════════════════════════════════ */
function generateNarrative(venue: Venue, label: string): string {
  const loc = venue.region === venue.district ? venue.district : `${venue.region} ${venue.district}`;
  const nick = venue.nickname || '담당자';

  /* ── 파트 1: 도입 템플릿 (업소 고유 데이터 기반) ── */
  const introTemplates = [
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${loc}에 자리한 ${l}이다. ${v.station ? v.station + '에서 접근할 수 있으며, ' : ''}${v.hours ? '영업시간은 ' + v.hours + '이다. ' : ''}이 지역에서 밤 문화를 즐기려는 사람이라면 한 번쯤 들어봤을 이름이다.`,
    (v: Venue, l: string) => `${v.district}에 있는 ${v.name}. ${v.card_hook || '직접 방문해야 분위기를 제대로 알 수 있는 곳이다.'} ${v.station ? v.station + ' 인근이라 대중교통 접근이 편리하다.' : '위치는 방문 전 네비게이션으로 확인해두는 것이 좋다.'}`,
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${loc} 소재 ${l}이다. ${v.card_hook || '현장 분위기를 직접 확인해보는 것을 추천한다.'} ${v.hours ? '운영 시간은 ' + v.hours + '으로, ' : ''}방문 전 전화 한 통으로 당일 상황을 파악할 수 있다.`,
    (v: Venue, l: string) => `${v.district}의 ${l}, ${v.name}. ${v.hours ? v.hours + '에 운영한다. ' : '운영 시간은 전화로 확인 가능하다. '}${v.station ? v.station + '에서 가까워 접근성이 좋고, ' : ''}이 지역을 아는 사람이라면 빼놓기 어려운 곳이다.`,
    (v: Venue, l: string) => `${v.name}${iGa(v.name)} ${v.district}에서 눈에 띄는 건 이유가 있다. ${v.card_hook || '방문해보면 왜 이 동네에서 이야기가 되는지 금방 알게 된다.'} ${v.station ? '가장 가까운 역은 ' + v.station + '이다.' : ''}`,
    (v: Venue, l: string) => `${loc}에 위치한 ${v.name}${eunNeun(v.name)} ${l} 중에서도 개성이 뚜렷한 곳이다. ${v.card_hook || '한 번 방문하면 다시 찾게 되는 매력이 있다.'} ${v.hours ? '영업시간: ' + v.hours + '.' : ''}`,
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${v.district} 중심가에 자리 잡았다. ${v.card_hook || '이 동네를 안다면 한 번쯤 들어봤을 곳이다.'} ${v.station ? v.station + '에서 가까워 접근성이 좋다.' : '네비게이션에 주소를 입력하면 바로 안내된다.'}`,
    (v: Venue, l: string) => `${loc}의 야간 문화를 이야기할 때 빠지지 않는 ${v.name}. ${v.card_hook || '현지인 사이에서 이미 정평이 나 있다.'} 한번 와보면 왜 그런지 금방 알게 된다. ${v.station ? v.station + '이 가장 가까운 역이다.' : ''}`,
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${loc}에서 빼놓을 수 없는 ${l}이다. ${v.station ? v.station + '에서 내리면 도보로 금방이다.' : '내비게이션에 주소를 넣으면 건물 앞까지 안내된다.'} 방문 전 전화로 상황을 확인하면 더 수월하다.`,
    (v: Venue, l: string) => `${v.district}에서 ${l}${eulReul(l)} 찾는다면 ${v.name}${eunNeun(v.name)} 후보군에서 빠지기 어렵다. ${v.card_hook || '직접 가보면 왜 추천 받는지 알게 된다.'} ${v.hours ? v.hours + ' 사이에 운영된다.' : ''}`,
  ];
  const introFn = introTemplates[hash(venue.slug + ':intro:v2') % introTemplates.length];
  const introPara = introFn(venue, label).replace(/\s{2,}/g, ' ').trim();

  /* ── 파트 2: 오프닝 훅 (venue 데이터 기반) ── */
  const selectedHooks = generateOpeningHooks(venue, label, loc, nick);

  /* ── 파트 3: 지역/위치 맥락 (venue 데이터 기반) ── */
  const locationParas = generateLocationContext(venue, label, loc, nick);

  /* ── 파트 4: 경험 묘사 (venue 데이터 기반) ── */
  const expParas = generateExperienceParas(venue, label, nick);

  /* ── 파트 5: 업소 속성 기반 고유 문단 ── */
  const uniqueParas: string[] = [];

  // 닉네임 담당자 정보
  if (venue.nickname) {
    const nickVariants = [
      `담당인 ${venue.nickname}에게 미리 연락하면 ${venue.name} 방문이 한결 수월해진다. 초행자에게 맞는 좌석 안내부터 당일 분위기 설명까지 받을 수 있다. 모르는 것이 있으면 부담 없이 물어보면 친절하게 안내해준다.`,
      `${venue.nickname}이라고 불리는 담당자가 있다. 전화 한 통이면 ${venue.name}의 당일 운영 상황을 정확히 알려준다. 예약이 필요한지, 몇 시에 가는 게 좋은지 등 실질적인 정보를 얻을 수 있다.`,
      `${venue.name} 방문 전 ${venue.nickname}에게 연락하는 걸 추천한다. 현장 상황을 가장 잘 아는 사람이므로, 인원수와 목적을 말하면 그에 맞는 안내를 받을 수 있다.`,
    ];
    uniqueParas.push(nickVariants[hash(venue.slug + ':nick:v2') % nickVariants.length]);
  }

  // card_hook 기반 확장
  if (venue.card_hook && venue.card_hook.length > 10) {
    const hookExpand = [
      `"${venue.card_hook}" — 이 한 줄이 ${venue.name}${eulReul(venue.name)} 정확히 설명한다. 직접 가보면 왜 이런 평가를 받는지 금방 납득이 된다. 기대치를 넘기는 경험이 ${venue.district}에 있다.`,
      `${venue.card_hook}. 이것이 ${venue.name}${eulReul(venue.name)} 한 번이라도 와본 사람들이 입을 모아 하는 말이다. 과장이 아니라는 것은 ${venue.district}에서 직접 확인하는 수밖에 없다.`,
    ];
    uniqueParas.push(hookExpand[hash(venue.slug + ':hk:v2') % hookExpand.length]);
  }

  // 태그 기반
  if (venue.tags && venue.tags.length > 0) {
    const tag = venue.tags[hash(venue.slug + ':tg:v2') % venue.tags.length];
    const tagParas = [
      `${tag} 일대를 자주 찾는 사람이라면 ${venue.name}${eunNeun(venue.name)} 이미 들어봤을 것이다. 아직 안 가봤다면 다음 기회에 한번 들러보자. 분명 새로운 기준이 생길 것이다.`,
      `${tag}에서 밤을 보내본 적이 있다면 ${venue.name}과 비교해보는 것도 재밌다. ${venue.name}${eunNeun(venue.name)} 그 비교의 기준을 새로 세워줄 곳이다.`,
    ];
    uniqueParas.push(tagParas[hash(venue.slug + ':tp:v2') % tagParas.length]);
  }

  // ── venue 고유 데이터 기반 추가 문단 ──
  const vKw = venue.keywords || [];
  const vTags = venue.tags || [];
  const vAddr = venue.address || '';
  const vCardVal = (venue as any).card_value || '';
  const hrs = venue.hours || '';
  const stn = venue.station || '';

  if (vKw.length >= 2) {
    uniqueParas.push(`${vKw[0]}${eunNeun(vKw[0])} ${venue.name}${eulReul(venue.name)} 설명하는 첫 번째 키워드다. 그리고 ${vKw[1]}${iGa(vKw[1])} 두 번째. 이 두 가지를 직접 체험하러 오는 사람이 대부분이다. ${venue.district}에서 이 조합을 갖춘 곳은 ${venue.name}${iGa(venue.name)} 유일하다.`);
  }
  if (vKw.length >= 3) {
    uniqueParas.push(`${venue.name}${eulReul(venue.name)} 검색하면 ${vKw[0]}, ${vKw[1]}, ${vKw[2]} 같은 단어가 따라붙는다. 이게 다 이유가 있다. ${venue.district}에서 ${venue.name}만의 색깔이 분명하기 때문이다.`);
  }

  if (vTags.length >= 2) {
    uniqueParas.push(`${vTags[0]}과 ${vTags[1]}${iGa(vTags[1])} 만나는 곳. ${venue.name}${eunNeun(venue.name)} 이 두 가지 무드를 동시에 제공한다. ${venue.region}에서 이런 조합은 쉽게 찾기 어렵다.`);
  }
  if (vTags.length >= 3) {
    uniqueParas.push(`${venue.name}${eulReul(venue.name)} 세 단어로 요약하면: ${vTags[0]}, ${vTags[1]}, ${vTags[2]}. 이 세 가지가 ${venue.district}에서 ${venue.name}${eulReul(venue.name)} 특별하게 만드는 요소다.`);
  }

  if (vAddr) {
    const addrParts = vAddr.split(' ');
    const addrDetail = addrParts.length > 2 ? addrParts.slice(0, 3).join(' ') : vAddr;
    uniqueParas.push(`${venue.name}${eunNeun(venue.name)} ${addrDetail}에 위치해 있다. 이 동선을 알면 ${venue.district} 일대를 처음 방문하는 사람도 헤맬 일이 없다. ${nick}에게 미리 연락하면 정확한 진입 경로를 안내받을 수 있다.`);
  }

  if (hrs) {
    uniqueParas.push(`${venue.name}${eunNeun(venue.name)} ${hrs}에 운영된다. 이 시간대에 맞춰 ${venue.district} 근처에서 저녁을 먹고 오면 동선이 완벽해진다. ${nick}에게 전화하면 당일 영업 여부를 바로 확인할 수 있다.`);
  }

  if (stn) {
    uniqueParas.push(`${stn}에서 ${venue.name}까지는 도보로 금방이다. ${venue.district} 상권이 역 주변에 밀집해 있어서 걸어가는 동안 볼거리도 충분하다. 대중교통을 이용하면 주차 걱정 없이 ${venue.name}${eulReul(venue.name)} 즐길 수 있다.`);
  }

  if (vCardVal) {
    uniqueParas.push(`${venue.name}${eunNeun(venue.name)} "${vCardVal}"라는 한 마디로 설명되는 곳이다. ${venue.district}에서 이런 평가를 받는 ${label}${eunNeun(label)} 흔치 않다.`);
  }

  const vCardTags = (venue as any).card_tags || [];
  if (vCardTags.length >= 2) {
    uniqueParas.push(`${venue.name}${eulReul(venue.name)} 방문한 사람들이 꼽는 키워드는 ${vCardTags.slice(0, 3).join(', ')}이다. ${venue.district}의 ${label} 중에서 이 세 가지를 동시에 갖춘 곳은 ${venue.name}뿐이다.`);
  }

  /* ── 파트 6: 시간대 추천 (venue 데이터 기반) ── */
  const timeReco = [generateTimeRecoText(venue, label, nick)];

  /* ── 파트 7: 첫 방문자 팁 (venue 데이터 기반) ── */
  const ftTip = [generateFirstTimerTip(venue, label, nick)];

  /* ── 파트 8: 마무리 훅 (venue 데이터 기반) ── */
  const closing = [generateClosingHook(venue, label, nick)];

  /* ── 파트 9: 키워드 밀도 보강 ── */
  const kwBoostTemplates = [
    `${venue.name}${eulReul(venue.name)} 검색해서 이 글까지 왔다면, 이미 관심이 있다는 뜻이다. 직접 가보면 검색으로는 알 수 없던 현장 분위기를 체감하게 된다.`,
    `${venue.name} 방문 전에 전화 한 통 넣는 게 현명하다. 당일 상황이랑 좌석 여부를 바로 확인할 수 있다.`,
    `솔직히 ${venue.name}${eunNeun(venue.name)} 호불호가 갈릴 수 있다. 근데 직접 가보기 전에 판단하지 말자. 현장 분위기는 글로 전달하기 어렵다.`,
    `${venue.name}${iGa(venue.name)} 이 동네에서 이야기가 되는 건 다 이유가 있다. 와본 사람한테 물어보면 안다.`,
    `${venue.name}${eunNeun(venue.name)} 한 번 가본 사람이 다시 찾는 데는 이유가 있다. ${venue.name}의 재방문율이 높다는 건 만족도가 높다는 거다.`,
    `${venue.name}${eulReul(venue.name)} 처음 가는 거라면 주말보다 평일을 추천한다. ${venue.name}${eunNeun(venue.name)} 여유 있을 때 가야 제대로 즐긴다.`,
  ];
  const nameLen = venue.name.length;
  const nameEsc = venue.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nameRe = new RegExp(nameEsc, 'g');

  /* ── 밀도 반복 보정 — 전체 페이지 1.5~2.5% 범위 ── */
  // H1(1) + H2(3) + FAQ(~1) + breadcrumb(1) + comparison(1) + guide(1) = 8
  const extraMentions = 8;
  // Non-narrative: FAQ + guide + tips + H2 labels + info + time + misc
  const extraChars = 1200;

  // ── 섹션 순서를 venue별 해시로 셔플 → 구조적 유사도 감소 ──
  const sections = [
    { id: 0, parts: [introPara] },
    { id: 1, parts: selectedHooks },
    { id: 2, parts: locationParas },
    { id: 3, parts: expParas },
    { id: 4, parts: uniqueParas },
    { id: 5, parts: timeReco },
    { id: 6, parts: ftTip },
    { id: 7, parts: closing },
  ];
  // intro 항상 첫 번째, 나머지 셔플
  const rest = sections.slice(1).map((s, i) => ({ ...s, h: hash(venue.slug + ':ord:' + i) })).sort((a, b) => a.h - b.h);
  // 긴 이름(8자+)은 전체 섹션 유지 (밀도 희석 필요), 짧은 이름은 ~20% 제외
  const needAllSections = nameLen >= 8;
  const included = needAllSections ? rest : rest.filter((_, i) => hash(venue.slug + ':inc:' + i) % 5 !== 0);
  const baseParts = [introPara, ...included.flatMap(s => s.parts)];
  let finalText = baseParts.join('\n\n');

  // 전체 페이지 밀도 측정 (본문 + 구조적 요소)
  const totalDensity = (txt: string) => {
    const cnt = (txt.match(nameRe) || []).length;
    return ((cnt + extraMentions) * nameLen) / (txt.length + extraChars) * 100;
  };

  // 1단계: 전체 밀도 < 1.5% → kwBoost 추가
  for (let i = 0; i < kwBoostTemplates.length; i++) {
    if (totalDensity(finalText) >= 1.5) break;
    const candidate = finalText + '\n\n' + kwBoostTemplates[i];
    if (totalDensity(candidate) > 2.5) break;
    finalText = candidate;
  }

  // 2단계: 전체 밀도 > 2.5% → 뒤쪽 이름을 대명사로 교체
  if (totalDensity(finalText) > 2.5) {
    const cnt = (finalText.match(nameRe) || []).length;
    if (cnt > 1) {
      const targetTotal = Math.floor((finalText.length + extraChars) * 0.025 / nameLen);
      const target = Math.max(1, targetTotal - extraMentions);
      const toRemove = cnt - target;
      if (toRemove > 0) {
        const pronoun = hasJong(venue.name) ? '이곳' : '여기';
        const parts = finalText.split(venue.name);
        const keep = Math.max(1, parts.length - 1 - toRemove);
        const rebuilt: string[] = [];
        for (let i = 0; i < parts.length; i++) {
          rebuilt.push(parts[i]);
          if (i < parts.length - 1) rebuilt.push(i < keep ? venue.name : pronoun);
        }
        finalText = rebuilt.join('');
      }
    }
  }

  return finalText;
}

/* ═══════════════════════════════════════
   업소별 FAQ — 실제 데이터 기반
   ═══════════════════════════════════════ */
function generateFaq(venue: Venue, _label: string): { q: string; a: string }[] {
  const allFaq: { q: string; a: string }[] = [
    {
      q: `${venue.name} 영업시간이 어떻게 되나요?`,
      a: venue.hours
        ? `${venue.hours}에 운영합니다. 요일이나 시즌에 따라 변동 가능하니 방문 전 전화 확인을 권장합니다.`
        : '요일에 따라 상이합니다. 방문 전 전화로 확인하시면 정확합니다.',
    },
    {
      q: '위치가 어디인가요?',
      a: venue.address
        ? `${venue.address}에 위치합니다.${venue.station ? ' ' + venue.station + '에서 접근 가능합니다.' : ''}`
        : `${venue.district} ${venue.region} 소재입니다.${venue.station ? ' ' + venue.station + '에서 접근 가능합니다.' : ' 정확한 위치는 전화 문의가 빠릅니다.'}`,
    },
    {
      q: '입장 연령 기준이 있나요?',
      a: `만 19세 이상만 출입 가능합니다. ${venue.district} 일대 대부분의 업소가 동일하며 신분증(주민등록증, 운전면허증, 여권)을 반드시 지참하세요.`,
    },
    {
      q: '사전 예약이 필요한가요?',
      a: venue.cat_slug === 'yojeong' ? '예약제로 운영됩니다. 반드시 사전에 전화로 예약하세요.'
        : venue.cat_slug === 'room' ? '예약을 권장합니다. 인원수와 목적을 미리 알려주시면 적합한 공간을 배정받을 수 있습니다.'
        : '예약 없이 방문 가능하지만, 주말에는 미리 연락하시는 편이 안전합니다.',
    },
    {
      q: '1인 방문도 괜찮은가요?',
      a: venue.cat_slug === 'room' ? '보통 2인 이상 이용을 권장하지만, 전화로 문의하시면 안내받을 수 있습니다.'
        : venue.cat_slug === 'hoppa' ? '당연하다. 혼자 오는 분도 많고 매니저가 처음부터 끝까지 챙겨준다.'
        : '바 카운터에 앉으면 혼자서도 자연스럽게 분위기에 녹아든다.',
    },
    {
      q: '주차는 가능한가요?',
      a: venue.station
        ? `인근 유료 주차장을 이용하거나 ${venue.station} 대중교통을 추천합니다.`
        : '인근 유료 주차장을 이용하시거나 택시를 추천합니다.',
    },
    {
      q: '결제 방법은 어떻게 되나요?',
      a: `${venue.district}에서는 카드 결제가 가능합니다. 다만 일부 서비스는 현금만 되는 경우도 있으니 소액 현금을 준비하세요.`,
    },
    {
      q: '복장 규정이 있나요?',
      a: venue.cat_slug === 'club' ? '드레스코드가 있습니다. 깔끔한 캐주얼 이상, 슬리퍼·반바지·운동복은 입장 제한됩니다.'
        : venue.cat_slug === 'yojeong' ? '격식을 갖춘 복장을 권장합니다. 비즈니스 캐주얼 이상이 적합합니다.'
        : '깔끔한 캐주얼이면 충분합니다. 슬리퍼나 운동복은 제한될 수 있습니다.',
    },
    {
      q: '가장 붐비는 시간대는 언제인가요?',
      a: venue.cat_slug === 'lounge' ? '금·토요일 저녁 9시~11시가 가장 활발합니다.'
        : venue.cat_slug === 'yojeong' ? '저녁 6시~9시 예약이 가장 많습니다.'
        : '금·토요일 23시~새벽 1시가 피크타임입니다. 일찍 도착하면 좋은 자리를 확보하기 쉽다.',
    },
    {
      q: '방문 전 뭘 준비하면 좋을까요?',
      a: venue.cat_slug === 'night' ? '전화 한 통이면 된다. 운영 시간이랑 시스템 물어보고 가면 훨씬 편하다.'
        : venue.cat_slug === 'club' ? '드레스코드랑 운영 일정은 SNS나 전화로 미리 체크하자. 입장 거절당하면 민망하거든.'
        : venue.cat_slug === 'yojeong' ? '인원이랑 목적을 전화로 먼저 알려주자. 그래야 제대로 된 세팅을 받는다.'
        : venue.cat_slug === 'room' ? '인원수와 목적을 전화로 미리 알리면 딱 맞는 공간을 안내받을 수 있습니다.'
        : '전화로 미리 문의하면 시스템과 분위기를 상세히 안내받을 수 있습니다.',
    },
    {
      q: '문의 연락처가 어떻게 되나요?',
      a: venue.nickname && venue.nickname_phone
        ? `담당 ${venue.nickname}(${venue.nickname_phone})에게 연락하시면 됩니다.`
        : venue.phone ? `${venue.phone}으로 전화 문의하시면 됩니다.`
        : '상단 기본 정보에 기재된 연락처를 참고하세요.',
    },
    {
      q: `${venue.district} 근처에 식사할 곳이 있나요?`,
      a: `${venue.district} 인근에 여러 음식점이 있습니다. ${venue.region}에서 저녁 식사 후 방문하면 자연스러운 코스가 됩니다.`,
    },
  ];
  return pick(allFaq, venue.slug, 7, 10);
}

/* ═══ 업소별 인기 시간대 — 카테고리 기반 + 해시 변동 ═══ */
function generateTimeSlots(venue: Venue): { time: string; level: string; bar: string }[] {
  const vary = (base: number, seed: number): number => {
    const h = hash(venue.slug + ':ts:' + seed);
    const delta = (h % 25) - 12;
    return Math.min(98, Math.max(5, base + delta));
  };
  const levelOf = (pct: number): string => {
    if (pct <= 20) return '한산';
    if (pct <= 40) return '여유';
    if (pct <= 60) return '보통';
    if (pct <= 75) return '활발';
    if (pct <= 88) return '붐빔';
    return '피크';
  };
  type TB = { time: string; base: number; seed: number };
  const patterns: Record<string, TB[]> = {
    club: [
      { time: '평일 저녁', base: 15, seed: 0 },
      { time: '금요일 23시~', base: 82, seed: 1 },
      { time: '토요일 자정~', base: 93, seed: 2 },
      { time: '일요일', base: 12, seed: 3 },
    ],
    night: [
      { time: '평일 저녁', base: 25, seed: 0 },
      { time: '금요일 22시~', base: 78, seed: 1 },
      { time: '토요일 22시~', base: 90, seed: 2 },
      { time: '일요일', base: 18, seed: 3 },
    ],
    lounge: [
      { time: '평일 저녁', base: 38, seed: 0 },
      { time: '금·토 20시~', base: 75, seed: 1 },
      { time: '금·토 23시~', base: 58, seed: 2 },
      { time: '일요일', base: 28, seed: 3 },
    ],
    room: [
      { time: '평일', base: 32, seed: 0 },
      { time: '금요일 저녁', base: 72, seed: 1 },
      { time: '토요일 저녁', base: 85, seed: 2 },
      { time: '일요일', base: 22, seed: 3 },
    ],
    yojeong: [
      { time: '평일 점심', base: 42, seed: 0 },
      { time: '평일 저녁', base: 68, seed: 1 },
      { time: '주말 저녁', base: 88, seed: 2 },
      { time: '공휴일', base: 52, seed: 3 },
    ],
    hoppa: [
      { time: '평일', base: 18, seed: 0 },
      { time: '금요일 22시~', base: 80, seed: 1 },
      { time: '토요일 23시~', base: 92, seed: 2 },
      { time: '일요일', base: 14, seed: 3 },
    ],
  };
  const pat = patterns[venue.cat_slug] || patterns.night;
  return pat.map(p => {
    const pct = vary(p.base, p.seed);
    return { time: p.time, level: levelOf(pct), bar: pct + '%' };
  });
}

/* ═══ 업소별 첫 방문 가이드 ═══ */
function generateGuide(venue: Venue): { intro: string; tips: string[] } {
  const catIntros: Record<string, string> = {
    club: `${venue.name}${eunNeun(venue.name)} 플로어 중심의 사운드 공간이다. 드레스코드를 확인하고 방문하자. 입장 후 DJ의 선곡에 따라 분위기가 달라지니, 자신이 좋아하는 장르의 라인업이 있는 날에 방문하면 만족도가 높다.`,
    night: `${venue.name}${eunNeun(venue.name)} 테이블 중심의 사교 공간이다. 입장 후 웨이터가 자리를 안내하며, 테이블 위치에 따라 경험이 크게 달라진다. 미리 연락해서 좋은 자리를 확보하자.`,
    lounge: `${venue.name}${eunNeun(venue.name)} 대화가 주인공인 공간이다. 음악 볼륨이 낮아 상대방 목소리가 선명하게 들린다. 소개팅, 기념일, 비즈니스 미팅 모두에 적합한 분위기다.`,
    room: `${venue.name}${eunNeun(venue.name)} 프라이빗한 독립 공간이다. 인원수에 맞는 사이즈를 미리 확인하자. 전화로 인원과 목적을 전달하면 적합한 룸을 배정받을 수 있다.`,
    yojeong: `${venue.name}${eunNeun(venue.name)} 한정식 코스와 국악 공연이 함께하는 전통 공간이다. 예약제로 운영되며 사전 연락이 필수다. 격식 있는 자리에 적합하다.`,
    hoppa: `${venue.name}${eunNeun(venue.name)} 여성이 편하게 즐길 수 있는 공간이다. 매니저가 시스템을 처음부터 설명해주니 긴장할 필요가 없다. 취향에 맞는 호스트를 매칭받을 수 있다.`,
  };
  const catTips: Record<string, string[]> = {
    club: ['드레스코드 확인 필수 — 슬리퍼, 운동복 입장 불가', '플로어 위치에 따라 사운드 경험이 다르다', '귀중품은 최소한으로 가져가자'],
    night: ['테이블 위치가 경험을 좌우한다 — 미리 요청하자', '피크타임 전에 도착하면 좋은 자리를 선점할 수 있다', '라이브 공연 시간을 미리 확인하면 좋다'],
    lounge: ['시그니처 칵테일부터 시도해보자', '바 카운터는 1인 방문자도 환영한다', '주말 저녁은 예약을 추천한다'],
    room: ['전화로 인원수와 목적을 미리 전달하자', '방문 전 전화 문의로 룸 상태를 확인하자', '기념일 장식 등 특별 요청이 가능한지 물어보자'],
    yojeong: ['사전 예약이 필수다', '정장 또는 비즈니스 캐주얼 복장을 권장한다', '알레르기가 있으면 예약 시 미리 전달하자'],
    hoppa: ['매니저가 시스템을 친절하게 설명해준다', '호스트 지명은 선택사항이다', '친구와 함께 방문하면 분위기가 더 활기차다'],
  };

  let intro = catIntros[venue.cat_slug] || catIntros.night;
  if (venue.station) intro += ` ${venue.station}에서 접근 가능.`;
  if (venue.hours) intro += ` 영업시간: ${venue.hours}.`;

  const tips = [...(catTips[venue.cat_slug] || catTips.night)];
  if (venue.nickname && venue.nickname_phone) tips.push(`문의: ${venue.nickname} ${venue.nickname_phone}`);
  return { intro, tips };
}

/* ═══ 메타 설명 — 업소별 고유 (130~155자, 유사도 10% 이하) ═══ */
const descFacts = [
  'B1F 입장','2F 라운지','3F VIP존','옥상 테라스','지하 1층','복층 구조','단층 홀',
  '바 카운터석','소파 구역','스탠딩 존','좌석 60석','테이블 30개','룸 5개','홀 200평',
  'DJ 상주','라이브 밴드','가요 위주','EDM 중심','R&B 선곡','힙합 비트','트로트 라이브',
  '칵테일 바','위스키 셀렉션','수제 맥주','와인 리스트','샴페인 구비','논알콜 가능',
  '22시 오픈','23시 피크','자정 만석','새벽 2시 마감','새벽 5시까지','주말 올나잇',
  '금토 붐빔','평일 여유','월화 한산','수목 적당','일요 조용','공휴일 만석',
  '역 도보 3분','역 5분 거리','버스 정류장 앞','주차 가능','발렛 운영','택시 잡기 편함',
  '남녀 비율 적당','20~30대 중심','30~50대 혼합','전 연령 환영','커플석 있음','1인 가능',
  '신분증 필수','입장 시 확인','드레스코드 있음','캐주얼 OK','슬리퍼 금지','정장 불필요',
  '예약 추천','워크인 가능','전화 문의 후','카톡 예약','당일 방문 OK','사전 연락 필수',
  '카드 결제','현금 병행','간편결제 가능','정산 편리','영수증 발급','개별 계산 OK',
  '환기 좋음','에어컨 쾌적','흡연 구역 별도','금연 실내','난방 잘됨','공기질 관리',
  '포토존 있음','인스타 감성','네온 인테리어','우드톤 마감','대리석 바','빈티지 조명',
  '가벼운 안주','핑거푸드','과일 플래터','마른안주 세트','식사 메뉴 없음','디저트 가능',
  '프라이빗 룸','독립 공간','파티션 설치','오픈 플로어','반개방 구조','완전 독립 부스',
  '음향 장비 우수','스피커 JBL','턴테이블 상주','마이크 가능','노래방 모드','볼륨 조절 가능',
  '귀가 택시 편리','대리 호출 쉬움','막차 23시40분','심야버스 이용','도보 귀가 가능','숙소 근처',
  '주변 맛집 많음','편의점 1분','카페 인접','PC방 근처','찜질방 도보권','호텔 연계',
  '재방문율 높음','단골 많음','입소문 유명','후기 좋음','평점 4.5','현지인 추천',
  '웨이터 친절','매니저 상주','사장 직접 운영','직원 교육됨','응대 빠름','콜벨 없음',
  '기념일 세팅','서프라이즈 가능','생일 이벤트','단체 가능','소모임 적합','2차 장소',
  '여름 시즌 인기','겨울 아늑함','봄 신메뉴','연말 예약 필수','크리스마스 만석','밸런타인 추천',
  '사진 촬영 제한','플래시 금지','동영상 OK','SNS 공유 환영','리뷰 이벤트','태그 할인',
  '외국인 환영','영어 가능','일본어 가능','중국어 메뉴','글로벌 손님','해외 후기 있음',
  '화장실 깨끗','거울 넓음','파우더룸 별도','드라이어 구비','세면대 2개','비상구 2곳',
];

function generateDescription(venue: Venue, _label: string, venueIndex = 0): string {
  const nm = venue.name;
  const hook = venue.card_hook || '';
  const nick = venue.nickname;
  const stn = venue.station || '';
  const hrs = venue.hours || '';
  const tag0 = (venue.tags && venue.tags[0]) || '';
  const tag1 = (venue.tags && venue.tags[1]) || '';
  const addr = venue.address || '';
  const kw = venue.keywords || [];
  const seoExtra = (venue as any).seo_extra || '';
  const h = hash(venue.slug + ':desc:v4:' + venueIndex);
  const pattern = h % 10;

  const district = venue.district || '';
  const region = venue.region || '';
  const _descKBG = (s: string): Set<string> => {
    const set = new Set<string>();
    for (const p of (s.match(/[가-힣]+/g) || [])) {
      if (p.length >= 2) set.add(p);
      for (let i = 0; i <= p.length - 2; i++) set.add(p.slice(i, i + 2));
    }
    return set;
  };
  const nmBG = _descKBG(nm);
  const regionSafe = (() => {
    const rBG = _descKBG(region);
    for (const bg of rBG) if (bg.length >= 2 && nmBG.has(bg)) return '';
    return region;
  })();
  const districtSafe = (() => {
    const dBG = _descKBG(district);
    for (const bg of dBG) if (bg.length >= 2 && nmBG.has(bg)) return '';
    return district;
  })();
  const nameParts = nm.split(' ');
  const shortName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nm;
  const addrShort = addr ? addr.split(' ').slice(0, 2).join(' ') : '';
  const hasPrefix = nameParts.length > 1;
  const brandName = hasPrefix ? shortName : nm;
  const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let cleanHook = hook.replace(new RegExp('^' + escRe(region) + '(?:동|구|시|역)?\\s*[,·]?\\s*'), '').trim();
  if (district && district !== region) cleanHook = cleanHook.replace(new RegExp('^' + escRe(district) + '(?:동|구|시|역)?\\s*[,·]?\\s*'), '').trim();
  cleanHook = cleanHook.replace(new RegExp('(?:^|\\s)' + escRe(region) + '(?:동|구|시|역)?(?=\\s|,|$)', 'g'), '').trim();
  if (district) cleanHook = cleanHook.replace(new RegExp('(?:^|\\s)' + escRe(district) + '(?:동|구|시|역)?(?=\\s|,|$)', 'g'), '').trim();
  cleanHook = cleanHook.replace(/^[,·\s]+/, '').trim();
  if (cleanHook.length < 5) cleanHook = hook;
  let desc: string;
  if (pattern === 0) {
    desc = nm + '. ' + cleanHook;
  } else if (pattern === 1) {
    desc = cleanHook + ' — ' + nm;
  } else if (pattern === 2) {
    desc = brandName + ', ' + cleanHook + (districtSafe ? '. ' + districtSafe : '');
  } else if (pattern === 3) {
    desc = (stn ? stn + ' ' : '') + nm + '. ' + cleanHook;
  } else if (pattern === 4) {
    desc = brandName + (hrs ? '(' + hrs + ')' : '') + '. ' + cleanHook + '. ' + nm;
  } else if (pattern === 5) {
    desc = cleanHook + '. ' + ((addrShort || regionSafe) ? (addrShort || regionSafe) + ' ' : '') + brandName;
  } else if (pattern === 6) {
    desc = ((addrShort || districtSafe) ? (addrShort || districtSafe) + ' ' : '') + brandName + '. ' + cleanHook;
  } else if (pattern === 7) {
    desc = brandName + '. ' + (stn ? stn + ' 인근. ' : '') + cleanHook;
  } else if (pattern === 8) {
    desc = ((stn || addrShort || regionSafe) ? (stn || addrShort || regionSafe) + ' ' : '') + brandName + ', ' + cleanHook;
  } else {
    desc = cleanHook + '. ' + brandName + (hrs ? '. ' + hrs : '');
  }
  if (!desc.includes(nm)) {
    const withName = desc + '. ' + nm;
    if (withName.length <= 150) desc = withName;
  }

  const allExtras: string[] = [];
  if (seoExtra && !desc.includes(seoExtra)) allExtras.push(seoExtra);
  if (stn && !desc.includes(stn)) allExtras.push(stn);
  if (hrs && !desc.includes(hrs)) allExtras.push(hrs);
  if (tag0 && !desc.includes(tag0)) allExtras.push(tag0);
  if (tag1 && !desc.includes(tag1)) allExtras.push(tag1);
  if (kw[1] && !desc.includes(kw[1])) allExtras.push(kw[1]);
  if (kw[2] && !desc.includes(kw[2])) allExtras.push(kw[2]);
  if (addr && addr.length < 40 && !desc.includes(addr)) allExtras.push(addr);
  if (nick && !desc.includes(nick)) allExtras.push(nick + ' 문의');
  const korBigramsD = (s: string): Set<string> => {
    const set = new Set<string>();
    const parts = s.match(/[가-힣]+/g) || [];
    for (const p of parts) {
      if (p.length >= 2) set.add(p);
      for (let i = 0; i <= p.length - 2; i++) set.add(p.slice(i, i + 2));
    }
    return set;
  };
  const descBG = korBigramsD(desc);
  const descWords = new Set(desc.split(/[\s,.—·]+/).filter(w => w.length >= 2));
  const filtered = allExtras.filter(e => {
    const eWords = e.split(/[\s,.]+/).filter(w => w.length >= 2);
    const overlap = eWords.filter(w => {
      if (descWords.has(w)) return true;
      const wBG = korBigramsD(w);
      for (const bg of wBG) if (bg.length >= 2 && descBG.has(bg)) return true;
      return false;
    }).length;
    return overlap < eWords.length * 0.5;
  });
  const shuffled = filtered.map((e, i) => ({ e, s: hash(venue.slug + ':ex:' + i) })).sort((a, b) => a.s - b.s).map(x => x.e);

  for (const e of shuffled) {
    if ((desc + '. ' + e).length > 150) break;
    desc += '. ' + e;
  }

  desc = desc.replace(/\.\s*\./g, '.').replace(/\s{2,}/g, ' ').replace(/—\s*—/g, '—').trim();

  const dSentences = desc.split(/(?<=\.)\s+/).filter(s => s.trim().length > 0);
  const seenBG = new Set<string>();
  const dedupSentences: string[] = [];
  for (const sent of dSentences) {
    const parts = sent.match(/[가-힣]+/g) || [];
    const bgs: string[] = [];
    for (const p of parts) {
      if (p.length >= 2) bgs.push(p);
      for (let i = 0; i <= p.length - 2; i++) bgs.push(p.slice(i, i + 2));
    }
    if (bgs.length === 0) { dedupSentences.push(sent); continue; }
    const overlap = bgs.filter(b => seenBG.has(b)).length;
    if (overlap / bgs.length < 0.5) {
      dedupSentences.push(sent);
      for (const b of bgs) seenBG.add(b);
    }
  }
  desc = dedupSentences.join(' ');

  if (!desc.endsWith('.')) desc += '.';
  if (desc.length > 150) desc = desc.slice(0, 147) + '...';
  return desc;
}

/* ═══════════════════════════════════════
   메인 콘텐츠 생성
   ═══════════════════════════════════════ */
export function generateGoldContent(venue: Venue, venueIndex = 0) {
  const tagline = getTagline(venue, venueIndex);
  const label = catLabel[venue.cat_slug] || venue.category;

  const narrative = generateNarrative(venue, label);
  const faq = generateFaq(venue, label);
  const nick = venue.nickname || '담당자';
  // tips: venue별 고유 데이터 기반 생성 (이름 사용 최소화 → 밀도 제어)
  const venueTips: string[] = [
    `방문 전 ${nick}에게 전화하면 당일 상황을 바로 파악할 수 있다.`,
    `${venue.district} 일대는 ${venue.station ? venue.station + '에서 접근이 편리하다' : '택시 이용이 가장 편하다'}. 대중교통이면 주차 걱정이 없다.`,
    venue.hours ? `영업시간은 ${venue.hours}이다. 시즌에 따라 변동 가능하니 사전 확인 필수.` : `영업시간은 전화로 확인하자. 시즌별로 달라질 수 있다.`,
    `신분증은 반드시 지참. ${venue.district} 대부분의 업소가 만 19세 이상만 입장 가능하다.`,
    `근처 맛집을 미리 알아두면 저녁부터 새벽까지 동선이 깔끔해진다.`,
    `음주 후 운전은 절대 금물. ${venue.station ? venue.station + ' 대중교통이나' : ''} 대리운전 앱을 미리 준비하자.`,
    `방문 시 보조배터리를 꼭 챙기자. ${venue.district}에서 새벽에 배터리가 방전되면 귀가가 어렵다.`,
    `복장은 깔끔하게. ${venue.district}에서 첫인상이 입장 여부를 좌우하는 곳도 있다.`,
  ];
  const tips = pick(venueTips, venue.slug, 6, 20);
  const description = generateDescription(venue, label, venueIndex);
  const timeSlots = generateTimeSlots(venue);
  const guide = generateGuide(venue);

  // ── 한국어 2글자 바이그램 추출 → 합성어 내부 겹침까지 감지 ──
  const korBigrams = (s: string): Set<string> => {
    const set = new Set<string>();
    const parts = s.match(/[가-힣]+/g) || [];
    for (const p of parts) {
      if (p.length >= 2) set.add(p);
      for (let i = 0; i <= p.length - 2; i++) set.add(p.slice(i, i + 2));
    }
    return set;
  };
  const korOverlap = (a: string, b: string): boolean => {
    const aB = korBigrams(a);
    const bB = korBigrams(b);
    for (const x of aB) if (x.length >= 2 && bB.has(x)) return true;
    return false;
  };

  // 제목: 풀네임만 사용 (region·label이 이름과 한글 겹치면 추가 안 함)
  const namePart = venue.name;
  const extras: string[] = [];
  if (venue.region && !namePart.includes(venue.region) && !korOverlap(namePart, venue.region)) extras.push(venue.region);
  if (label && !namePart.includes(label) && !korOverlap(namePart, label)) extras.push(label);
  const nameWithExtras = [namePart, ...extras].join(' ');

  // 이름 바이그램 수집 (hook 필터용)
  const nameBG = korBigrams(nameWithExtras);
  const usedWords = new Set(nameWithExtras.split(/[\s,·—]+/).filter(w => w.length >= 2));

  // "가게이름 — 후킹제목" 형식 (tagline에서 이름과 겹치는 한국어 단어 제거)
  let hookShort = tagline.length > 30 ? tagline.slice(0, 28) + '…' : tagline;
  const hookUsed = new Set<string>();
  hookShort = hookShort.split(/\s+/).filter(w => {
    const clean = w.replace(/[,·]/g, '');
    if (clean.length < 2) return true;
    if (usedWords.has(clean) || hookUsed.has(clean)) return false;
    const wBG = korBigrams(clean);
    for (const bg of wBG) if (bg.length >= 2 && nameBG.has(bg)) return false;
    hookUsed.add(clean);
    return true;
  }).join(' ').replace(/^[,\s·]+/, '').trim();
  hookShort = hookShort.replace(/\s+\S*[의에은는을를과와]$/, '').trim();
  // 그래도 너무 짧으면 venue 데이터 기반 대체 tagline
  if (hookShort.split(/\s+/).filter(w => w.length >= 2).length < 3) {
    const fallbackTags = [
      `${venue.district}에서 한 번 가면 다시 찾게 되는 곳`,
      `직접 가본 사람만 아는 ${venue.district}의 진짜 이야기`,
      `${venue.district} 단골들이 추천하는 이유가 있다`,
      `${venue.region}에서 분위기로 인정받는 곳`,
      `${nick}에게 전화 한 통이면 시작되는 밤`,
    ];
    for (let attempt = 0; attempt < fallbackTags.length; attempt++) {
      const candidate = fallbackTags[(hash(venue.slug + ':tl:fb:' + attempt)) % fallbackTags.length];
      const cFiltered = candidate.split(/\s+/).filter(w => {
        const clean = w.replace(/[,·]/g, '');
        if (clean.length < 2) return true;
        const wBG = korBigrams(clean);
        for (const bg of wBG) if (bg.length >= 2 && nameBG.has(bg)) return false;
        return true;
      }).join(' ').replace(/^[,\s·]+/, '').trim();
      if (cFiltered.split(/\s+/).filter(w => w.length >= 2).length >= 3) {
        hookShort = cFiltered;
        break;
      }
    }
  }
  // hook 내부 한국어 단어 중복 제거
  const hookWords = hookShort.split(/\s+/);
  const hookSeen = new Set<string>();
  const hookFinal = hookWords.filter(w => {
    const k = w.match(/[가-힣]{2,}/g) || [];
    for (const kw of k) {
      for (const seen of hookSeen) {
        if (kw.includes(seen) || seen.includes(kw)) return false;
      }
    }
    for (const kw of k) hookSeen.add(kw);
    return true;
  }).join(' ');
  hookShort = hookFinal || hookShort;

  const pageTitle = `${nameWithExtras} — ${hookShort}`;

  return {
    title: pageTitle,
    description,
    tagline,
    narrative,
    ogImage: `${SITE_URL}/og/${venue.cat_slug}-${venue.slug}.png`,
    guide,
    tips,
    faq,
    timeSlots,
  };
}

/* ═══ 카테고리 페이지 콘텐츠 ═══ */
export function getCategoryContent(catSlug: string) {
  const data: Record<string, { title: string; description: string; heading: string; intro: string }> = {
    club: {
      title: `전국 클럽 가이드 ${YEAR} — 플로어 사운드 완전 정리`,
      description: '홍대, 이태원, 강남, 부산, 제주까지. DJ 라인업과 플로어 사운드를 지역별로 정리했다. 입장 팁부터 단골이 추천하는 시간대까지.',
      heading: '전국 클럽 가이드 — 플로어 사운드 완전 정리',
      intro: '솔직히 말할게. 전국 클럽 수십 곳을 돌았다. 진짜 괜찮은 데는 손에 꼽는다. 금요일 밤 11시, 문 열고 들어가는 순간 베이스가 심장을 때리는 곳. EDM 드롭이 떨어질 때 소름이 쫙 돋는 곳. 그런 데만 골라서 정리했다. 강남은 VIP 부스와 메인 플로어가 갈리거든. 스타일에 따라 고르면 된다. 홍대는 좀 다르다. 언더그라운드 씬 특유의 날것 같은 에너지가 살아 있다. 이태원은 외국인 비율이 높아서 글로벌한 분위기고, 압구정·청담은 작지만 감각적인 부티크 사운드가 있다. 근데 한 가지 단점. 드레스코드 까다로운 데가 꽤 있다. 슬리퍼에 반바지? 입장 거절이다. 셔츠에 깔끔한 신발이면 대부분 통과된다. 금토 자정 전후가 피크타임이고, 23시 전에 도착하면 대기 없이 바로 들어간다. 수요일이나 목요일 레이디스 나이트 운영하는 곳도 있으니까 평일도 노려볼 만하다. 당신이라면 금요일에 갈래, 토요일에 갈래? 분위기가 완전히 다르거든. 주차는 대부분 인근 유료 주차장을 쓰는데, 솔직히 택시가 편하다. 대리 부르는 것보다 낫다.',
    },
    night: {
      title: `전국 나이트 가이드 ${YEAR} — 테이블 사교 완전 정리`,
      description: '수유, 상봉, 인천, 수원 등 전국 나이트 테이블석 배치와 입장 시스템을 지역별로 정리했다. 밴드 공연 일정부터 첫 방문 준비까지.',
      heading: '전국 나이트 가이드 — 테이블 사교의 모든 것',
      intro: '삼촌이 데려갔다. 처음엔 긴장했다. 근데 밴드가 첫 곡 시작하니까 몸이 알아서 움직이더라. 나이트는 그런 곳이다. 20대부터 60대까지, 테이블 앞에서 춤추는 그 순간만큼은 나이가 의미 없다. 전국 나이트를 하나하나 정리했다. 분위기는 어떤지, 어떤 음악이 나오는지, 주차는 되는지, 몇 시에 가야 흥이 제대로인지. 웨이터 닉네임이랑 직통 연락처까지 파악해놨으니까 가기 전에 전화 한 통 넣으면 된다. 수유·노원·상봉은 전통 사교 문화가 강하고 밴드 퀄리티가 높기로 유명하다. 수원·인천·성남 같은 경기권도 서울 못지않은 규모다. 부산·대전·광주까지 지방 주요 도시 대형 나이트도 전부 담았다. 단점 하나. 금요일 9시에 갔더니 이미 빈 테이블이 없었다. 예약 필수라는 얘기다. 테이블 배정, 웨이터 시스템, 밴드 타임까지 미리 알고 가면 훨씬 여유 있다. 라이브 밴드의 첫 곡이 시작되면 그날 밤은 확실히 달라진다. 돌아가는 택시 안에서 "다음엔 언제 갈까" 검색하고 있는 자신을 발견하게 될 거다.',
    },
    lounge: {
      title: `전국 라운지·바 가이드 ${YEAR} — 분위기 있는 저녁 완전 정리`,
      description: '압구정, 청담, 강남 일대 바 카운터 무드와 시그니처 칵테일 정보를 정리한 라운지 가이드. 소개팅, 기념일, 혼술까지.',
      heading: '전국 라운지 가이드 — 잔이 채워지는 저녁',
      intro: '시끄러운 데 질렸다. 옆 사람 목소리가 안 들리는 곳은 이제 그만이다. 라운지는 다르다. 볼륨이 낮아서 대화가 진짜로 된다. 칵테일 잔을 기울이면서 이야기를 나눌 수 있는 공간. 소개팅 장소로 여기 잡으면 솔직히 반은 먹고 들어간다. 기념일에 데려가면 점수 따는 건 보장한다. 강남부터 청담, 압구정까지 분위기 좋은 라운지만 골라서 정리했다. 바 카운터 끝자리에 앉아봐. 세상이 잠깐 멈추는 느낌이 온다. 바텐더한테 "기분에 맞는 거 하나" 하면 진짜 잘 만들어준다. 혼자 와서 카운터에 앉아도 전혀 어색하지 않다. 둘이 와서 소파석에 앉으면 세상이 조용해지는 곳. 근데 단점 하나. 솔직히 좀 비싸다. 그래도 한 번 앉아보면 이게 공간값이란 걸 안다. 인테리어, 시그니처 메뉴, 좌석 배치, 방문자 후기까지 미리 확인하고 가면 실패 없는 저녁이 된다. 오늘 저녁, 어디에서 잔을 채울지 여기서 정하자. 음악 볼륨이 대화를 안 잡아먹는다는 거. 이거 진짜 중요한 포인트다. 두 잔째부터 말이 많아지는 곳, 그런 데가 좋은 라운지다.',
    },
    room: {
      title: `전국 룸 가이드 ${YEAR} — 프라이빗 단체 모임 완전 정리`,
      description: '일산, 해운대 등 전국 프라이빗 룸 세팅과 이용 안내를 정리했다. 회식, 접대, 기념일 모임에 맞는 공간 찾기.',
      heading: '전국 룸 가이드 — 문 닫으면 우리만의 시간',
      intro: '문 닫히는 순간 세상이 사라진다. 우리끼리만 남는다. 회식, 모임, 기념일. 남의 눈치 안 보고 즐기고 싶을 때 룸만 한 게 없다. 전국 룸을 하나씩 정리했다. 어디가 넓은지, 어디가 서비스 좋은지, 몇 명까지 되는지. 일산부터 해운대까지. 공간이 바뀌면 분위기도 바뀌거든. 비즈니스 접대라면 격식 있는 세팅이 되는 곳을 골라야 하고, 친구 모임이라면 편하게 떠들 수 있는 데가 중요하다. 거래처 사장님이 "다음에도 여기서 하자" 했다. 그 한마디면 된 거다. 방 크기, 음향, 조명, 서비스까지 미리 파악하고 가면 자리가 한결 매끄러워진다. 인원이 바뀔 수 있으면 여유 있는 사이즈로 잡는 게 현명하다. 전화 한 통이면 당일 상황부터 예약 가능 여부까지 바로 확인된다. 좋은 공간에서 시작된 모임은 결과도 다르다. 오늘 밤, 문 닫고 우리만의 온전한 시간을 만들자. 들어가서 나올 때까지 3시간이었는데 체감은 1시간도 안 됐다. 그런 곳이 좋은 룸이다. 10명이 왔는데 안 좁았다. 배치를 이렇게 잘 해놓은 데는 처음이었다.',
    },
    yojeong: {
      title: `전국 요정 가이드 ${YEAR} — 한정식·국악 풍류 완전 정리`,
      description: '코스 요리와 판소리가 어우러지는 전국 요정 가이드. 예약 요령, 에티켓, 코스 구성까지 첫 방문자 필독.',
      heading: '전국 요정 가이드 — 풍류가 살아 있는 곳',
      intro: '아버지가 왜 이런 데를 좋아하셨는지 와보니까 알겠다. 한정식 나오는데 판소리가 깔린다. 소름 돋았다. 진짜로. 코스가 7번째쯤 나올 때 "이게 진짜구나" 했다. 격이 달랐거든. 접대, 비즈니스, 격 있는 모임에 요정만 한 곳이 없다. 외국 바이어 데려갔더니 한국 또 오고 싶다고 했다. 여기 때문에. 전국 요정을 정리했다. 대부분 완전 예약제니까 최소 며칠 전에는 연락을 넣어야 한다. 예약 없이 가면 거절당한다. 농담 아니고 진짜다. 코스 구성은 보통 전채부터 후식까지 10첩 이상이고, 국악 공연은 식사 중간에 자연스럽게 이어진다. 한복 차려입은 직원이 문 열어주는 순간부터 공기가 달라진다. 정갈한 상차림, 가야금 선율. 다른 어디에서도 느끼기 어려운 분위기다. 중요한 자리일수록 여기를 잡아야 한다. 공간이 절반을 해주니까. 예약 절차, 복장 에티켓, 코스 구성까지 미리 확인하고 격 있는 자리를 준비하자. 한 번 와본 사람은 기준이 바뀐다. 다른 데서 만족을 못 하게 되거든. 풍류라는 단어가 이런 거구나. 음악 듣고 술 마시고 대화하고.',
    },
    hoppa: {
      title: `전국 호빠 가이드 ${YEAR} — 여성을 위한 선택지 완전 정리`,
      description: '장안동, 건대 등 전국 호빠의 매니저 시스템 해설과 첫 방문 가이드를 정리했다. 시스템, 분위기, 솔직한 후기까지.',
      heading: '전국 호빠 가이드 — 오늘 주인공은 당신',
      intro: '처음이라 떨렸다. 근데 매니저가 다 알려줬다. 긴장 5분 만에 풀렸다. 호빠는 그런 곳이다. 호스트가 대화를 이끌어주니까 혼자 와도 전혀 어색하지 않다. 친구들이랑 오면 더 시끌벅적하게 즐길 수 있고. 강남부터 부산까지, 분위기 좋은 곳만 골라서 정리했다. 어떤 시스템인지, 어떤 분위기인지, 혼자 가도 괜찮은지. 궁금한 거 전부 담았다. 장안동, 건대, 강남, 부산 등 지역마다 분위기랑 시스템이 조금씩 다르거든. 미리 비교해보고 가는 게 현명하다. 타입 말하면 맞춰준다. 이 정도면 솔직히 놀랍다. 친구 생일마다 여기 온다. 매번 반응이 "여기 뭐야 대박"이다. 담당 매니저한테 전화하면 당일 상황이랑 이벤트 여부까지 바로 안내해준다. 첫 방문이든 재방문이든, 미리 파악하고 가면 만족도가 확 달라진다. 오늘 밤 주인공이 될 준비, 여기서 시작하자. 한 번 경험하면 기준이 생긴다. 다른 데 가면 비교하게 되거든. 그날 저녁이 계속 생각나는 건 술 때문이 아니라 대화 때문이다. 마치 오랜 친구랑 마시는 것 같은 편안함.',
    },
  };
  return data[catSlug] || data.club;
}
