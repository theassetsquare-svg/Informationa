import { Venue } from './venues';

export const SITE_NAME = '밤키';
const YEAR = new Date().getFullYear();

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

/* ═══ 태그라인 풀 (카테고리별) ═══ */
const clubTaglines = [
  '비트가 몸을 감싸는 순간, 시간이 멈춘다',
  '조명이 꺼지면 사운드가 공간을 지배한다',
  '플로어 위에서 시간을 잊게 되는 곳',
  '에너지가 올라갈수록 공간이 달라진다',
  '입구를 지나는 순간 일상이 멈춘다',
  '사운드 시스템이 다른 차원인 곳',
  '이곳이 아니면 어디를 가겠나',
  'DJ의 선곡이 온도를 결정한다',
  '처음 오면 놀라고, 두 번째부턴 단골이 된다',
  '이 동네 야간 문화의 중심축',
  '드레스코드를 지키면 경험이 달라진다',
  '스피커에서 나오는 베이스가 가슴을 때린다',
  '줄 서서라도 들어가야 하는 이유가 있다',
  '여기 음악이 좋다는 건 이미 정평이 나 있다',
  '입장하면 현실은 문 밖에 두고 온다',
  '플로어에 서면 모두가 하나가 된다',
  '자정이 지나야 진짜가 시작된다',
  '조명과 사운드의 조합이 완벽한 곳',
  '한 번 경험하면 평범한 저녁은 심심해진다',
  '주말이면 대기줄이 생기는 데는 이유가 있다',
  '여기 단골은 다른 곳에서 만족 못 한다',
  '입구부터 느껴지는 에너지가 남다르다',
  '몸이 먼저 반응하는 사운드',
  '이 지역 플로어의 기준을 세운 곳',
  '새벽까지 에너지가 떨어지지 않는 공간',
  '처음 가도 분위기에 금방 녹아든다',
  '라인업이 달라지면 분위기도 달라진다',
  '여기서 보낸 시간은 오래 기억에 남는다',
  '사운드를 제대로 느끼려면 안쪽으로 가라',
  '평일에도 사람이 빠지지 않는 곳',
  '이 공간의 에너지는 직접 와봐야 안다',
  '친구를 데려오면 감사 인사 받는 곳',
  '매주 다른 분위기를 기대할 수 있다',
  '여기 다녀온 사람들 표정이 다 비슷하다',
  '나갈 때쯤 다음 주 약속을 잡게 된다',
];

const nightTaglines = [
  '테이블에 앉는 순간 주인공이 된다',
  '격식과 흥이 동시에 존재하는 드문 장소',
  '이 동네 야간 문화의 산증인',
  '오래된 단골이 많다는 건 이유가 분명하다',
  '피크타임의 열기를 직접 느껴봐야 안다',
  '한번 오면 다른 데 못 간다는 후기가 많다',
  '좌석 배치부터 남다른 전략이 필요한 곳',
  '자정이 넘으면 진짜 분위기가 시작된다',
  '주말이면 이 거리가 들썩인다',
  '전통과 현대가 공존하는 사교장',
  '한 번 앉으면 시간이 어떻게 가는지 모른다',
  '단골이 단골을 부르는 곳',
  '웨이터가 알아서 분위기를 만들어준다',
  '빈 자리를 찾기 어려운 금·토요일',
  '이 거리에서 가장 오래된 곳에는 이유가 있다',
  '양주 한 병이면 저녁이 달라진다',
  '자리 잡고 앉으면 시작이다',
  '여기 분위기를 말로 설명하기 어렵다',
  '처음 왔는데 벌써 단골 된 기분',
  '이 좌석을 잡았다면 운이 좋은 거다',
  '깊어질수록 뜨거워지는 곳',
  '일찍 도착하면 좋은 자리를 고를 수 있다',
  '한잔 걸치면서 하루를 마무리하기 딱 좋다',
  '이 동네 사람들이 모이는 데는 이유가 있다',
  '오래 앉아 있어도 지루하지 않은 구조다',
  '자리마다 다른 분위기를 즐길 수 있다',
  '전화 한 통이면 그날 분위기를 미리 알 수 있다',
  '여기를 모르면 이 동네를 모르는 거다',
  '사전에 도착하면 여유롭게 시작한다',
  '안쪽 부스석의 프라이버시가 남다르다',
  '첫 방문이라도 직원이 잘 안내해준다',
  '주중에 오면 한결 여유롭게 즐길 수 있다',
  '이 분위기는 직접 와봐야 안다',
  '동행과 대화가 편한 좌석 구성이 장점이다',
  '미리 예약하면 대기 없이 바로 입장한다',
  '두세 번 와봐야 진짜 매력을 알게 된다',
  '시간이 갈수록 흥이 올라간다',
  '자정 무렵이 가장 뜨거운 시간대다',
  '평일 저녁은 여유로운 분위기를 원하는 사람에게 딱이다',
  '이곳의 단골은 다른 데 갈 생각을 안 한다',
  '입장부터 퇴장까지 흠잡을 데가 없다',
  '소문 듣고 왔다가 단골이 된 사람이 많다',
  '여기 직원들 응대가 다른 곳과 확실히 다르다',
  '주변 맛집까지 코스로 엮으면 완벽한 저녁이다',
  '한 자리에서 저녁부터 새벽까지 가능하다',
  '귀가할 때쯤 또 오고 싶다는 생각이 든다',
  '아무한테나 알려주기 아까운 곳',
  '잘 모르면 지나치기 쉬운 숨은 명소',
  '경험자 사이에서 입소문 난 곳',
  '가성비를 따지면 여기가 답이다',
  '주차가 좀 불편하지만 그래도 가는 이유가 있다',
  '음악 선곡이 좋다는 후기가 유독 많다',
  '자주 가는 사람만 아는 골든타임이 있다',
  '이곳 분위기에 반하면 다른 데 못 간다',
  '한 번 앉으면 나가기 싫어지는 마력이 있다',
  '이 동네 저녁의 마무리는 항상 여기다',
  '조명이 바뀔 때마다 공간이 달라진다',
  '여기를 찾아오는 사람들의 표정이 전부 말해준다',
  '금요일 밤이면 빈 테이블을 찾기 어렵다',
  '예약 없이 왔다가 대기하게 된 사람이 한둘이 아니다',
  '한 번 경험하면 비교 대상이 사라진다',
  '주변에 물어보면 열에 여덟은 여기를 추천한다',
  '마지막 곡이 끝나도 자리에서 일어나기 아쉬운 곳',
  '첫 방문자도 편하게 즐길 수 있는 구조다',
  '이 가격에 이 분위기를 찾기 힘들다',
];

const loungeTaglines = [
  '대화에 집중할 수 있는 유일한 저녁',
  '잔을 기울이며 시간이 천천히 흐르는 곳',
  '분위기만으로 값어치를 하는 공간',
  '볼륨이 낮아 대화가 주인공이 되는 곳',
  '첫 만남도 편안해지는 온도의 공간',
];

const roomTaglines = [
  '문이 닫히면 오롯이 우리만의 시간',
  '프라이빗한 공간에서 격식을 갖추다',
  '단체 모임도 비즈니스 접대도 여기서 해결된다',
  '인원수에 맞는 사이즈를 골라 앉으면 시작이다',
];

const yojeongTaglines = [
  '한정식과 국악이 어우러지는 전통의 현장',
];

const hoppaTaglines = [
  '여성을 위한 프리미엄 선택지',
  '처음이라도 편하게 시스템이 안내하는 곳',
  '분위기 좋고 서비스 확실한 프리미엄 공간',
  '오늘 주인공은 당신이 된다',
  '매니저가 처음부터 끝까지 에스코트한다',
  '예산 걱정 없이 즐길 수 있는 구조다',
  '친구랑 왔는데 혼자 온 것보다 재밌다',
  '시스템을 알면 긴장할 필요가 전혀 없다',
  '입장하면 편안한 분위기에 바로 적응된다',
  '선택의 폭이 넓어서 취향 저격 가능하다',
  '한 번 와본 사람은 반드시 다시 오는 곳',
  '여기 호스트는 대화가 된다는 후기가 많다',
  '분위기를 먼저 확인하고 싶다면 전화 한 통이면 된다',
  '퇴근 후 가볍게 즐기기에 딱 좋은 곳',
  '친구 생일이면 무조건 여기 데려온다',
  '처음 오는 친구한테 설명이 필요 없는 시스템',
];

function getTagline(venue: Venue, venueIndex: number): string {
  // card_hook은 업소별 100% 고유 → 타이틀 태그라인으로 사용하면 중복 0%
  if (venue.card_hook && venue.card_hook.length > 10) {
    // 50자 이내로 잘라서 타이틀에 적합하게
    const hook = venue.card_hook.slice(0, 50);
    return hook.endsWith('.') ? hook.slice(0, -1) : hook;
  }
  // fallback: 풀에서 선택
  const pools: Record<string, string[]> = {
    club: clubTaglines, night: nightTaglines, lounge: loungeTaglines,
    room: roomTaglines, yojeong: yojeongTaglines, hoppa: hoppaTaglines,
  };
  const pool = pools[venue.cat_slug] || clubTaglines;
  return pool[hash(venue.slug + ':tl:v7') % pool.length];
}

/* ═══ 서사 풀 — 48개 (업소명·카테고리·지역명 미사용) ═══ */
const narrativePool: string[] = [
  '문을 열고 들어서면 공기가 달라진다는 걸 느낀다. 조명의 톤과 배경 음악이 독자적인 분위기를 만들어놓고 있다.',
  '첫 방문이라면 입구에서 잠깐 멈춰 공간을 훑어보자. 어디에 자리를 잡느냐에 따라 경험이 크게 달라진다.',
  '내부가 깔끔하게 정돈돼 있다. 디테일에 신경 쓴 흔적이 곳곳에 보여 사진도 잘 나온다.',
  '외관만 보고 판단하지 마라. 안에 들어서면 느낌이 확 다르다는 후기가 많다.',
  '처음 왔는데도 편안한 느낌이 드는 건 직원 응대가 자연스럽기 때문이다.',
  '동행자가 있다면 입장 전 어떤 자리를 원하는지 미리 이야기해두는 게 좋다.',
  '이른 시간에 방문하면 한산한 분위기에서 공간을 천천히 느낄 수 있다.',
  '메인 홀 외에 별도의 구역이 있기도 하다. 직원에게 안내를 받아보자.',
  '첫인상이 강렬한 곳이다. 그래서 재방문율이 높다.',
  '입구부터 메인 공간까지 걸어가면서 전체 구성을 파악해보자. 예상과 다를 수 있다.',
  '인테리어 스타일에 호불호가 갈릴 수 있지만, 전반적인 완성도는 높은 편이다.',
  '공간의 향기까지 인상적이다. 작은 요소에도 신경 쓴다는 증거다.',
  '피크타임은 자정 무렵이다. 그 전에 도착하면 좋은 자리를 고를 여유가 생긴다.',
  '주중에 방문하면 여유로운 분위기를 만끽할 수 있다. 직원 응대도 한결 세심해진다.',
  '금·토요일에는 대기가 생길 수 있다. 일찍 움직이거나 주중을 노리는 것도 방법이다.',
  '오픈 직후에 방문하면 분위기가 형성되기 전이라 차분하게 공간을 살필 수 있다.',
  '토요일이 가장 붐비는 요일이다. 특별한 이유가 없다면 금요일이 조금 더 여유롭다.',
  '마감 시간이 가까워지면 분위기가 급격히 달라진다. 여유 있게 즐기려면 일찍 자리 잡자.',
  '계절에 따라 방문객 수가 달라진다. 여름과 연말이 특히 붐빈다.',
  '공휴일 전날은 주말 못지않게 사람이 몰린다. 미리 연락하는 편이 안전하다.',
  '주말 낮에 전화하면 저녁 상황을 알려준다. 부담 없이 문의하자.',
  '늦은 시간에 도착하면 이미 분위기가 무르익어 있어 바로 동화될 수 있다.',
  '이른 저녁에 출발해서 주변에서 식사한 뒤 방문하는 코스를 추천한다.',
  '비 오는 날에 방문하면 의외로 한산해서 여유롭게 보낼 수 있다.',
  '직원 응대가 다른 곳과 확실히 다르다. 초행자도 편하게 안내받을 수 있다.',
  '사전에 전화 한 통이면 당일 상황을 파악할 수 있다. 특히 주말에는 확인이 필수다.',
  '테이블 서비스가 기본이라 자리에 앉으면 직원이 먼저 다가온다.',
  '요청하면 좌석 변경이 가능한 경우가 많다. 불편하면 바로 말하자.',
  '스태프 추천 메뉴를 한번 물어보자. 직접 경험에서 나온 의견이라 참고가 된다.',
  '기념일이나 특별한 목적을 미리 알려주면 세팅을 도와주기도 한다.',
  '이름을 기억해주는 직원이 있다면 단골이 된 증거다.',
  '퇴장 시 안내까지 꼼꼼하다. 마지막 인상도 좋게 가져간다.',
  '접근성과 분위기를 동시에 잡은 몇 안 되는 곳이다. 교통편은 미리 확인해두자.',
  '주변에 식사할 곳이 많다. 저녁부터 자연스럽게 이어지는 동선이 완성된다.',
  '전화로 미리 문의하면 예산 계획이 수월하다.',
  '혼자 와도 어색하지 않은 구조다. 바 카운터가 자연스러운 1인석 역할을 한다.',
  '주차가 쉽지 않을 수 있다. 대중교통이나 택시 이용을 추천한다.',
  '예약이 필수는 아니지만 주말에는 미리 연락하는 편이 안전하다.',
  '1차로 끝낼 수도 있고, 근처에서 2차를 이어갈 수도 있다.',
  '귀가 교통편을 미리 확인해두자. 새벽에는 택시 잡기가 어려울 수 있다.',
  '보조배터리와 현금을 챙기면 불편할 일이 줄어든다.',
  '다녀온 사람들의 공통 후기는 "다시 오고 싶다"이다. 그 이유는 직접 가봐야 안다.',
  '단체 모임 장소로 추천하면 실패 확률이 낮다. 공간이 그 역할을 해준다.',
  '두세 번 방문해야 진짜 매력이 보이기 시작한다. 처음에 아니다 싶어도 한 번 더 가보자.',
  'SNS 후기보다 직접 경험이 중요하다. 사진보다 실제가 나은 경우가 많다.',
  '친구를 데려왔다가 감사 인사를 받았다는 후기가 꽤 있다.',
  '나갈 때쯤 다음 방문 날짜를 정하게 된다. 그만큼 여운이 남는다.',
  '약속 장소를 정할 때 이곳을 떠올리는 사람이 점점 늘고 있다.',
  '입구의 간판보다 안쪽 인테리어가 기대를 넘긴다. 구석구석 촬영 포인트가 숨어 있다.',
  '화장실까지 깔끔하다는 건 운영진이 얼마나 신경 쓰는지 보여준다.',
  '조명 톤이 시간대에 따라 변한다. 같은 공간인데 다른 분위기를 경험하게 된다.',
  '바텐더에게 취향을 말하면 맞춤 추천을 받을 수 있다. 시도해볼 가치가 있다.',
  '방음이 잘 돼 있어 바깥에서는 소리가 거의 안 들린다. 주변 민원 걱정이 적다.',
  '엘리베이터를 타고 올라가면 전혀 다른 세계가 펼쳐진다. 고층에 위치한 곳의 매력이다.',
  '지하에 위치한 덕분에 외부 소음 차단이 완벽하다. 몰입도가 확연히 다르다.',
  '주차장에서 입구까지 동선이 짧다. 비 오는 날에도 불편함이 적다.',
  '건물 외관이 수수하다고 지나치지 마라. 안에서의 경험은 완전히 다른 이야기다.',
  '바 카운터 높이가 절묘하다. 서서 마셔도 앉아서 마셔도 편안한 설계다.',
  '좌석 간 간격이 넉넉해서 옆 테이블 대화가 신경 쓰이지 않는다.',
  '환기 시스템이 잘 갖춰져 있다. 오래 있어도 답답하지 않다.',
  '스피커 배치가 좋아서 어디에 앉아도 음악이 균일하게 들린다.',
  '커플석이 따로 마련돼 있다. 데이트 코스로 괜찮다는 의견이 많다.',
  '대기 중에도 음료를 제공하는 곳이 있다. 기다리는 시간도 지루하지 않다.',
  '단골이 되면 예약 없이도 좋은 자리를 배정받는 경우가 있다.',
  '직원들끼리 호흡이 잘 맞는다. 그래서 서비스 흐름이 자연스럽다.',
  '화요일이나 수요일에 가면 거의 프라이빗한 느낌이다. 조용한 분위기를 원하면 추천한다.',
  '이곳의 강점은 음식이 아니라 분위기다. 공간 자체가 콘텐츠인 셈이다.',
  '처음 방문했을 때 직원이 먼저 설명해줬다. 초행자에 대한 배려가 느껴졌다.',
  '대중교통 막차 시간을 꼭 확인하자. 놓치면 택시비가 만만치 않다.',
  '한 번 방문으로 판단하기엔 아까운 곳이다. 최소 두 번은 가봐야 감이 온다.',
  '여기 이야기를 해줬더니 관심 없던 친구가 같이 가겠다고 했다.',
  '처음이라 긴장했는데 나가면서는 다음 주 또 오자고 했다.',
  '근처에 노래방이나 포차가 있다면 2차 동선까지 한 번에 해결된다.',
  '비 오는 날 방문하면 실내 공간의 아늑함이 배가 된다.',
  '새벽 2시 넘으면 분위기가 또 다르다. 그 시간만의 독특한 매력이 있다.',
  '일요일 저녁에 가면 평일 시작 전 마지막 여유를 만끽할 수 있다.',
  '주변 주차 단속이 잦다. 불법주차는 절대 하지 말자.',
  '화재 비상구 위치를 습관적으로 확인하자. 안전이 먼저다.',
  '음료 한 잔이 주는 경험의 질이 다른 곳과 확실히 차이 난다.',
  '이 동네에서 밤을 보내려면 여기를 빼놓을 수 없다.',
  '현금 결제 시 할인 혜택이 있는 경우도 있다. 물어보면 손해 볼 것 없다.',
  '직원에게 추천 코스를 물어보면 2차까지 알려주는 경우도 있다.',
  '맥주 한 잔으로 시작해서 칵테일로 마무리하는 게 여기 정석이다.',
  '포토존이 따로 있어서 기념사진 남기기 좋다. SNS에 올릴 만한 컷이 나온다.',
  '평소 안 가던 장르의 음악을 여기서 처음 좋아하게 됐다는 사람이 많다.',
  '단골이 추천하는 시간대가 있다. 직원에게 슬쩍 물어보자.',
  '간판이 잘 안 보여서 처음에 헤맬 수 있다. 네비게이션을 끝까지 따라가자.',
  '건물 1층이 편의점이면 그 건물 맞다. 랜드마크를 기억해두면 찾기 쉽다.',
  '분위기가 좋으면 시간이 빨리 간다. 여기가 정확히 그런 곳이다.',
  '새벽에 나올 때 갑자기 추워질 수 있다. 외투를 꼭 챙기자.',
  '택시 기사에게 이곳 이름을 말하면 대부분 알아듣는다. 그만큼 유명하다.',
  '혼자 왔다가 옆 테이블 사람들과 이야기하게 되는 경우도 꽤 있다.',
  '이곳에서의 밤은 사진보다 기억으로 남는 종류다.',
  '입장 시 웨이팅이 길더라도 들어가면 그만한 이유가 있다는 걸 알게 된다.',
  '기대 없이 갔다가 취저를 당한 곳. 그래서 재방문율이 높다.',
  '퇴근 후 간단히 들르기에도 좋고, 주말 밤 제대로 즐기기에도 좋다.',
  '기분에 따라 선택할 수 있는 구역이 나뉘어 있다. 유연한 공간 활용이 인상적이다.',
];

/* ═══ 팁 풀 — 28개 ═══ */
const tipPool: string[] = [
  '피크타임 전에 도착하면 좋은 자리를 선점할 수 있다.',
  '신분증은 필수다. 없으면 입장이 불가능하다.',
  '보조배터리를 꼭 챙기자. 새벽에 배터리가 없으면 곤란하다.',
  '귀중품은 최소한으로 가져가자.',
  '음주 후 운전은 절대 금지. 대리운전이나 택시를 이용하자.',
  '복장은 깔끔하게. 첫인상이 경험을 좌우한다.',
  '물을 충분히 마셔두면 다음 날 컨디션이 한결 낫다.',
  '바 카운터에 앉으면 혼자서도 자연스럽게 분위기를 만끽할 수 있다.',
  '주변 맛집을 미리 알아두면 저녁부터 새벽까지 동선이 완성된다.',
  '주말에는 택시 잡기가 어렵다. 호출 앱을 미리 설치하자.',
  '처음 가는 곳이라면 너무 늦은 시간보다 오픈 직후가 편하다.',
  '동행자와 귀가 방법을 미리 합의해두면 편하다.',
  '사전에 전화로 상황을 확인하면 헛걸음을 줄인다.',
  '리뷰는 참고만 하자. 직접 가봐야 비로소 판단이 가능하다.',
  '음료를 주문할 때 추천을 물어보면 만족도가 높아진다.',
  '화장실 위치를 미리 파악해두면 편하다.',
  '소지품은 눈에 보이는 곳에 두자. 분실 주의.',
  '에어컨이 강한 곳이 있다. 겉옷 하나 챙기면 좋다.',
  '입장 전 현금 잔액을 확인하자. 카드가 안 되는 경우도 있다.',
  '주변 편의점 위치를 알아두면 유용하다.',
  '주차 요금을 미리 확인하면 예산 관리에 도움이 된다.',
  '사진 촬영이 제한되는 구역이 있을 수 있다. 확인 후 촬영하자.',
  '2차를 계획한다면 근처 선택지를 미리 알아두자.',
  '음주량 조절이 핵심이다. 즐거운 기억으로 남겨야 한다.',
  '흡연 구역을 미리 확인해두면 편하다.',
  '단체라면 예산을 나눌 방법을 미리 정해두자.',
  '영수증을 꼭 받자. 나중에 확인할 일이 생길 수 있다.',
  '방문 후기를 남기면 다른 사람에게 도움이 된다.',
];

const catLabel: Record<string, string> = {
  club: '클럽', night: '나이트', lounge: '라운지',
  room: '룸', yojeong: '요정', hoppa: '호빠',
};

/* ═══ 업소별 서사 생성 — 템플릿(고유) + 업소 속성 기반 고유 문단 + 풀(다양) ═══ */
function generateNarrative(venue: Venue, label: string): string {
  const loc = venue.region === venue.district ? venue.district : `${venue.region} ${venue.district}`;
  const tplVariants = [
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${loc}에 자리한 ${l}이다. ${v.station ? v.station + '에서 접근할 수 있다.' : '위치는 방문 전 확인하자.'} ${v.hours ? '영업시간은 ' + v.hours + '이다.' : ''}`,
    (v: Venue, l: string) => `${v.district}에 있는 ${v.name}. ${v.card_hook || '직접 방문해야 분위기를 알 수 있는 곳이다.'} ${v.station ? v.station + ' 인근이라 교통이 편리하다.' : ''}`,
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${loc} 소재 ${l}이다. ${v.card_hook || '현장 분위기를 직접 확인해보자.'}`,
    (v: Venue, l: string) => `${v.district}의 ${l}, ${v.name}. ${v.hours ? v.hours + '에 운영한다.' : '운영 시간은 전화로 확인 가능하다.'} ${v.station ? v.station + '에서 가깝다.' : ''}`,
    (v: Venue, l: string) => `${v.name}${iGa(v.name)} ${v.district}에서 눈에 띄는 건 분명하다. ${v.card_hook || '직접 방문해서 확인해보자.'} ${v.station ? '가장 가까운 역은 ' + v.station + '이다.' : ''}`,
    (v: Venue, l: string) => `${loc}에 위치한 ${v.name}. ${v.card_hook || '방문 전 전화 한 통을 추천한다.'} ${v.hours ? '영업시간: ' + v.hours + '.' : ''}`,
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${v.district} 중심가에 자리 잡았다. ${v.card_hook || '이 동네를 안다면 한 번쯤 들어봤을 곳이다.'} ${v.station ? v.station + '에서 가까워 접근성이 좋다.' : ''}`,
    (v: Venue, l: string) => `${v.district}에서 ${v.name}을 모르면 이 동네를 모르는 것과 같다. ${v.hours ? v.hours + ' 사이에 운영한다.' : ''} ${v.station ? v.station + '이 가장 가까운 역이다.' : ''}`,
    (v: Venue, l: string) => `${loc}의 야간 문화를 대표하는 ${v.name}. ${v.card_hook || '현지인 사이에서 이미 정평이 나 있다.'} 한번 와보면 왜 그런지 금방 알게 된다.`,
    (v: Venue, l: string) => `${v.name}${eunNeun(v.name)} ${loc}에서 빼놓을 수 없는 ${l}이다. ${v.station ? v.station + '에서 내리면 금방이다.' : '내비게이션에 주소를 넣으면 건물 앞까지 안내된다.'}`,
  ];
  const tplFn = tplVariants[hash(venue.slug + ':tpl') % tplVariants.length];
  const templatePara = tplFn(venue, label).replace(/\s{2,}/g, ' ').trim();

  // ── 업소 속성 기반 고유 문단 (공유 풀이 아닌 업소 데이터에서 직접 생성) ──
  const uniqueParas: string[] = [];

  // 교통 정보가 있으면 고유 문단
  if (venue.station) {
    const transVariants = [
      `${venue.station}에서 내려 걸으면 금방이다. ${loc} 일대를 처음 방문하는 사람이라면 역에서 나와 왼쪽 방향으로 5분 정도 걸어보자.`,
      `교통 면에서 ${venue.station}이 가장 가깝다. 주말 저녁에는 역 주변부터 사람이 몰리기 시작한다.`,
      `${venue.station}을 이용하면 접근이 수월하다. 막차 시간을 미리 체크해두는 것이 현명하다.`,
    ];
    uniqueParas.push(transVariants[hash(venue.slug + ':trans') % transVariants.length]);
  }

  // 닉네임이 있으면 고유 문단
  if (venue.nickname) {
    const nickVariants = [
      `담당인 ${venue.nickname}에게 미리 연락하면 방문이 한결 수월해진다. 초행자에게 맞는 좌석 안내부터 분위기 설명까지 받을 수 있다.`,
      `${venue.nickname}이라고 불리는 담당자가 있다. 전화 한 통이면 당일 상황을 정확히 알려준다.`,
      `방문 전 ${venue.nickname}에게 연락하는 걸 추천한다. 현장 상황을 가장 잘 아는 사람이다.`,
    ];
    uniqueParas.push(nickVariants[hash(venue.slug + ':nick') % nickVariants.length]);
  }

  // 영업시간 기반
  if (venue.hours) {
    const hourVariants = [
      `${venue.hours} 사이에 운영된다. 피크를 노린다면 개장 후 1~2시간 뒤가 가장 분위기가 좋다.`,
      `운영 시간은 ${venue.hours}이다. 늦게 도착하면 마감이 다가와 여유가 줄어드니 일찍 움직이자.`,
    ];
    uniqueParas.push(hourVariants[hash(venue.slug + ':hour') % hourVariants.length]);
  }

  // 주소 기반
  if (venue.address) {
    const addrVariants = [
      `${venue.address} 일대다. 네비게이션에 주소를 정확히 입력하면 건물 앞까지 안내된다.`,
      `위치는 ${venue.address}이다. 처음 방문이면 지도 앱을 켜두고 가는 걸 권한다.`,
    ];
    uniqueParas.push(addrVariants[hash(venue.slug + ':addr') % addrVariants.length]);
  }

  // 카테고리별 분위기 문단 (풀과 중복 안 되는 고유 표현)
  const catAtmo: Record<string, string[]> = {
    club: [
      `${venue.name}의 플로어는 자정이 넘으면서 진가를 발휘한다. DJ가 트랙을 바꾸는 순간 공간 전체가 한 박자에 맞춰 움직인다.`,
      `여기 사운드 시스템은 한 번 들으면 다른 곳이 밋밋하게 느껴진다는 의견이 지배적이다.`,
    ],
    night: [
      `${venue.name}의 테이블에 앉으면 웨이터가 먼저 다가온다. 처음이라 해도 자연스럽게 자리 잡을 수 있는 시스템이다.`,
      `라이브 밴드가 무대에 오르면 분위기가 달라진다. ${loc} 일대에서 이런 라이브를 경험할 수 있는 곳은 손에 꼽힌다.`,
    ],
    lounge: [
      `${venue.name}에서는 대화가 주인공이다. 음악 볼륨이 대화를 방해하지 않는 수준으로 세팅돼 있다.`,
      `바 카운터에 앉으면 바텐더의 손놀림을 구경하는 재미가 있다. 칵테일 한 잔이 완성되는 과정이 하나의 공연이다.`,
    ],
    room: [
      `${venue.name}의 문을 닫으면 바깥 세상과 완전히 분리된다. 프라이빗 공간의 가치가 여기서 증명된다.`,
      `단체 모임이라면 인원수를 정확히 알려주자. 그에 맞는 사이즈의 공간을 배정받을 수 있다.`,
    ],
    yojeong: [
      `${venue.name}에 들어서면 전통 건축의 멋이 먼저 눈에 들어온다. 한정식 코스가 하나씩 나올 때마다 대화의 격도 올라간다.`,
      `국악 공연이 시작되면 식사 중에도 분위기가 확 달라진다. 외국인 접대에 이만한 장소가 없다.`,
    ],
    hoppa: [
      `${venue.name}에 처음 방문하면 매니저가 시스템을 처음부터 설명해준다. 긴장할 필요가 전혀 없다.`,
      `여기 매니저들은 대화를 이끄는 능력이 수준급이다. 어색한 침묵이 생길 틈이 없다.`,
    ],
  };
  const atmos = catAtmo[venue.cat_slug] || catAtmo.night;
  uniqueParas.push(atmos[hash(venue.slug + ':atmo') % atmos.length]);

  // 지역 기반 고유 문단
  const regionParas: string[] = [];
  if (venue.region !== venue.district) {
    const regionV = [
      `${venue.region} 지역에서 ${venue.district}${eunNeun(venue.district)} 밤 문화의 중심축이다. 주변 상권과 연계되어 1차부터 3차까지 자연스러운 동선이 만들어진다.`,
      `${venue.district} 상권은 저녁이 되면 분위기가 확 달라진다. ${venue.name}${eunNeun(venue.name)} 그 중심에 자리잡고 있다.`,
      `${venue.region}에서 ${venue.district}까지 오는 길에 맛집도 많다. 저녁 식사 후 여기로 이어지는 동선을 추천한다.`,
    ];
    regionParas.push(regionV[hash(venue.slug + ':reg') % regionV.length]);
  }

  // card_hook 기반 확장
  if (venue.card_hook && venue.card_hook.length > 10) {
    const hookExpand = [
      `"${venue.card_hook}" — 이 한 줄이 ${venue.name}${eunNeun(venue.name)} 정확히 설명한다. 직접 가보면 왜 이런 평가를 받는지 금방 납득이 된다.`,
      `${venue.card_hook}. 이것이 여기를 한 번이라도 와본 사람들이 입을 모아 하는 말이다.`,
    ];
    regionParas.push(hookExpand[hash(venue.slug + ':hk') % hookExpand.length]);
  }

  // 태그 기반 고유 문단
  if (venue.tags.length > 0) {
    const tag = venue.tags[hash(venue.slug + ':tg') % venue.tags.length];
    const tagParas = [
      `${tag} 일대를 자주 찾는 사람이라면 ${venue.name}${eunNeun(venue.name)} 이미 들어봤을 것이다. 아직 안 가봤다면 이번 주말에 한번 들러보자.`,
      `${tag}에서 밤을 보내본 적이 있다면 비교 기준이 생길 것이다. ${venue.name}${eunNeun(venue.name)} 그 기준을 새로 세워줄 곳이다.`,
    ];
    regionParas.push(tagParas[hash(venue.slug + ':tp') % tagParas.length]);
  }

  // 업소명 기반 고유 마무리
  const closingV = [
    `${venue.name}을 한 줄로 표현하자면, 한 번 가면 기준이 바뀌는 곳이다.`,
    `${venue.name}의 진가는 두 번째 방문에서 드러난다. 처음엔 분위기에, 다음엔 디테일에 반하게 된다.`,
    `${venue.name}에 대한 평가는 직접 다녀온 사람의 말이 가장 정확하다.`,
    `${venue.name}을 추천받고 왔다면 추천한 사람에게 감사 인사를 전해도 좋다.`,
    `${venue.name}의 분위기를 글로 전하는 데는 한계가 있다. 직접 가보는 것만큼 확실한 방법은 없다.`,
    `${venue.name}이 아닌 다른 선택지를 비교하고 싶다면 같은 카테고리의 다른 곳도 둘러보자.`,
  ];
  uniqueParas.push(closingV[hash(venue.slug + ':close') % closingV.length]);

  // 시간대별 고유 팁
  const timeV = [
    `${loc}에서 ${venue.name}을 방문할 최적의 시간대는 개장 후 1시간쯤이다.`,
    `${venue.name} 주변은 주말이면 유동 인구가 급증한다. 일찍 출발하는 게 좋다.`,
    `평일에 ${venue.name}을 방문하면 주말과는 완전히 다른 분위기를 경험한다.`,
    `${venue.name}의 금요일 저녁과 토요일 밤은 온도가 다르다.`,
  ];
  uniqueParas.push(timeV[hash(venue.slug + ':time') % timeV.length]);

  // 풀에서 1개만 선택 (고유 문단이 충분)
  const poolParas = pick(narrativePool, venue.slug, 1, 0);

  return [templatePara, ...uniqueParas, ...regionParas, ...poolParas].join('\n\n');
}

/* ═══ 업소별 FAQ — 실제 데이터 기반 (12개 중 5개 선택) ═══ */
function generateFaq(venue: Venue, label: string): { q: string; a: string }[] {
  const allFaq: { q: string; a: string }[] = [
    {
      q: `${venue.name} 영업시간이 어떻게 되나요?`,
      a: venue.hours
        ? `${venue.hours}에 운영합니다. 요일이나 시즌에 따라 변동 가능하니 방문 전 전화 확인을 권장합니다.`
        : '요일에 따라 상이합니다. 방문 전 전화로 확인하시면 정확합니다.',
    },
    {
      q: `${venue.name} 위치가 어디인가요?`,
      a: venue.address
        ? `${venue.address}에 위치합니다.${venue.station ? ' ' + venue.station + '에서 접근 가능합니다.' : ''}`
        : `${venue.district} ${venue.region} 소재입니다.${venue.station ? ' ' + venue.station + '에서 접근 가능합니다.' : ' 정확한 위치는 전화 문의가 빠릅니다.'}`,
    },
    {
      q: '입장 연령 기준이 있나요?',
      a: '만 19세 이상만 출입 가능합니다. 신분증(주민등록증, 운전면허증, 여권)을 반드시 지참하세요.',
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
        : venue.cat_slug === 'hoppa' ? '물론입니다. 혼자 방문하는 분도 많으며 매니저가 편하게 안내해드립니다.'
        : '바 카운터를 이용하면 혼자서도 자연스럽게 분위기를 즐길 수 있습니다.',
    },
    {
      q: '주차는 가능한가요?',
      a: venue.station
        ? `인근 유료 주차장을 이용하거나 ${venue.station} 대중교통을 추천합니다.`
        : '인근 유료 주차장을 이용하시거나 택시를 추천합니다.',
    },
    {
      q: '결제 방법은 어떻게 되나요?',
      a: '카드 결제 가능합니다. 다만 일부 서비스는 현금만 되는 경우도 있으니 소액 현금을 준비하세요.',
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
        : '금·토요일 23시~새벽 1시가 피크타임입니다. 일찍 도착하면 좋은 자리를 확보할 수 있습니다.',
    },
    {
      q: '방문 전 뭘 준비하면 좋을까요?',
      a: venue.cat_slug === 'night' ? '전화로 운영 시간과 시스템을 미리 확인하면 편안하게 즐길 수 있습니다.'
        : venue.cat_slug === 'club' ? '드레스코드와 운영 일정을 SNS나 전화로 확인하고 가면 좋습니다.'
        : venue.cat_slug === 'yojeong' ? '인원과 목적을 전화로 미리 알리면 맞춤 안내를 받을 수 있습니다.'
        : venue.cat_slug === 'room' ? '인원수와 목적을 전화로 미리 알리면 딱 맞는 공간을 안내받을 수 있습니다.'
        : '전화로 미리 문의하면 시스템과 분위기를 상세히 안내받을 수 있습니다.',
    },
    {
      q: `${venue.name} 문의 연락처가 어떻게 되나요?`,
      a: venue.nickname && venue.nickname_phone
        ? `담당 ${venue.nickname}(${venue.nickname_phone})에게 연락하시면 됩니다.`
        : venue.phone ? `${venue.phone}으로 전화 문의하시면 됩니다.`
        : '상단 기본 정보에 기재된 연락처를 참고하세요.',
    },
    {
      q: '주변에 식사할 곳이 있나요?',
      a: `${venue.district} 인근에 다양한 음식점이 있습니다. 저녁 식사 후 방문하면 자연스러운 코스가 됩니다.`,
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

/* ═══ 업소별 첫 방문 가이드 — 업소 데이터 반영 ═══ */
function generateGuide(venue: Venue): { intro: string; tips: string[] } {
  const catIntros: Record<string, string> = {
    night: `${venue.name}${eunNeun(venue.name)} 테이블 중심의 사교 공간이다. 입장 후 웨이터가 자리를 안내한다.`,
    club: `${venue.name}${eunNeun(venue.name)} 플로어 중심 공간이다. 드레스코드를 확인하고 방문하자.`,
    lounge: `${venue.name}${eunNeun(venue.name)} 대화가 주인공인 공간이다. 음악 볼륨이 낮아 편안하다.`,
    room: `${venue.name}${eunNeun(venue.name)} 프라이빗 공간이다. 인원수에 맞는 사이즈를 미리 확인하자.`,
    yojeong: `${venue.name}${eunNeun(venue.name)} 한정식 코스와 공연이 함께하는 전통 공간이다. 예약제로 운영된다.`,
    hoppa: `${venue.name}${eunNeun(venue.name)} 여성 고객을 위한 공간이다. 시스템을 미리 이해하면 편하다.`,
  };
  const catTips: Record<string, string[]> = {
    night: ['양주 1병이 기본 주문 단위', '테이블 위치가 경험을 좌우한다', '피크타임 전에 도착하면 좋은 자리'],
    club: ['슬리퍼·운동복 입장 불가', '드레스코드 확인 필수', '귀중품은 최소한으로'],
    lounge: ['시그니처 칵테일부터 시도해보자', '바 카운터는 1인 환영', '주말 저녁은 예약 추천'],
    room: ['전화로 인원수와 목적 전달', '방문 전 전화 문의 추천', '픽업 서비스 있는 곳도 있다'],
    yojeong: ['사전 예약 필수', '정장 또는 비즈니스 캐주얼', '알레르기 있으면 미리 알려주자'],
    hoppa: ['매니저가 시스템 설명해준다', '호스트 지명은 선택사항', '예산 미리 정해두면 부담 없다'],
  };

  let intro = catIntros[venue.cat_slug] || catIntros.night;
  if (venue.station) intro += ` ${venue.station}에서 접근 가능.`;
  if (venue.hours) intro += ` 영업시간: ${venue.hours}.`;

  const tips = [...(catTips[venue.cat_slug] || catTips.night)];
  if (venue.nickname && venue.nickname_phone) tips.push(`문의: ${venue.nickname} ${venue.nickname_phone}`);
  return { intro, tips };
}

/* ═══ 메타 설명 — 업소별 100% 고유 (고유 카드훅+태그 활용) ═══ */
function generateDescription(venue: Venue, _label: string, _tagline: string, _venueIndex: number): string {
  /*
   * card_hook = 각 업소별 고유 마케팅 문구 (venues.json에 이미 있음)
   * card_hook이 있으면 그대로 사용 (완전 고유)
   * 없으면 이름+태그 조합
   */
  // 닉네임 중복 방지: card_hook에 이미 닉네임이 포함되면 추가하지 않음
  const nickStr = venue.nickname || '';
  const hookText = venue.card_hook || '';
  const nick = (nickStr && !hookText.includes(nickStr)) ? `${nickStr} 상담.` : '';
  const tags = (venue.card_tags || []).slice(0, 2).join(' ');

  if (hookText.length > 15) {
    return `${hookText}${nick ? ' ' + nick : ''}`.replace(/\s{2,}/g, ' ').trim().slice(0, 155);
  }
  // fallback: 이름 + 태그 + 닉네임
  const fallbackNick = nickStr ? `${nickStr} 상담.` : '';
  return `${venue.name}. ${tags}${fallbackNick ? ' ' + fallbackNick : ''}`.replace(/\s{2,}/g, ' ').trim().slice(0, 155);
}

/* ═══════════════════════════════════════
   메인 콘텐츠 생성
   ═══════════════════════════════════════ */
export function generateGoldContent(venue: Venue, venueIndex = 0) {
  const tagline = getTagline(venue, venueIndex);
  const label = catLabel[venue.cat_slug] || venue.category;

  const narrative = generateNarrative(venue, label);
  const faq = generateFaq(venue, label);
  const tips = pick(tipPool, venue.slug, 6, 20);
  const description = generateDescription(venue, label, tagline, venueIndex);
  const timeSlots = generateTimeSlots(venue);
  const guide = generateGuide(venue);

  return {
    tagline,
    title: `${venue.name} — ${tagline} | ${SITE_NAME}`,
    description,
    ogImage: `/og/${venue.cat_slug}-${venue.slug}.png`,
    narrative,
    faq,
    tips,
    timeSlots,
    guide,
    year: YEAR,
  };
}

/* ═══ 카테고리 페이지 콘텐츠 ═══ */
export function getCategoryContent(catSlug: string) {
  const data: Record<string, { title: string; description: string; heading: string; intro: string }> = {
    club: {
      title: `플로어 사운드 컬렉션 | ${SITE_NAME}`,
      description: '홍대·이태원·강남·제주 DJ 라인업과 플로어 사운드를 최신본으로 정리했습니다.',
      heading: '플로어 사운드, 한눈에 살펴보기',
      intro: '조명이 바뀌는 순간, 음악이 몸을 감싸는 순간, 옆 사람과 눈이 마주치는 순간. 그 경험은 다른 어디에서도 느낄 수 없습니다. EDM부터 힙합, 테크노까지 사운드와 분위기가 전혀 다른 각지의 플로어를 정리했습니다. 강남에서 홍대까지, 부산에서 제주까지. 직접 다녀본 사람들의 솔직한 이야기를 모았습니다. 어디가 진짜 좋은지, 어디가 분위기를 만드는지, 처음 가는 사람은 뭘 알아야 하는지. 금요일 밤 어디를 갈지 고민 중이라면 여기서 답을 찾을 수 있습니다. 플로어에 서는 순간 일상은 잠시 멈추고, 오직 비트만 남습니다. 그 무대 위에서 가장 빛나는 곳을 전부 정리했습니다.',
    },
    night: {
      title: `테이블 사교 모음집 | ${SITE_NAME}`,
      description: '수유·상봉·인천·수원 테이블석 배치와 입장 규정을 올해 데이터로 수록했습니다.',
      heading: '테이블 사교, 격식과 흥이 함께',
      intro: '나이트는 세대를 넘어 사람들이 모이는 곳입니다. 20대부터 60대까지, 라이브 밴드 앞에서 춤추는 그 순간만큼은 나이가 의미 없습니다. 테이블 중심의 전통 공간부터 모던 홀까지, 전국 나이트를 하나하나 정리했습니다. 분위기는 어떤지, 어떤 음악이 나오는지, 주차는 되는지, 언제 가야 가장 흥이 넘치는지. 웨이터 닉네임과 직통 연락처까지 확인할 수 있어서, 가기 전에 미리 파악하면 처음 방문도 한결 편합니다. 라이브 밴드의 첫 곡이 시작되면, 그날 밤은 다른 어떤 밤보다 특별해질 겁니다.',
    },
    lounge: {
      title: `대화 와인 셀렉션 | ${SITE_NAME}`,
      description: '압구정·청담 바 카운터 무드와 시그니처 칵테일을 에디션으로 소개합니다.',
      heading: '대화 와인, 잔이 채워지는 저녁',
      intro: '시끄러운 곳이 싫은 사람들을 위한 곳입니다. 조용한 음악, 편안한 소파, 좋은 술. 대화가 가능한 밤을 원한다면 라운지가 정답입니다. 볼륨이 낮아서 옆 사람 목소리가 선명하게 들리고, 칵테일 잔을 기울이며 이야기를 나눌 수 있는 공간. 소개팅, 기념일, 비즈니스 미팅에도 적합합니다. 강남부터 청담, 압구정까지. 분위기 좋은 라운지만 골라서 정리했습니다. 인테리어, 시그니처 메뉴, 좌석 배치, 방문자 후기까지 미리 확인하고 가면 실패 없는 저녁이 됩니다. 조명이 낮은 공간에서 잔이 채워지는 소리, 그것이 라운지의 매력입니다.',
    },
    room: {
      title: `프라이빗 단체 룸 목록 | ${SITE_NAME}`,
      description: '일산·해운대 독립 세팅 구성과 이용 안내를 개정판으로 담았습니다.',
      heading: '프라이빗 단체, 문 닫으면 우리만의 시간',
      intro: '프라이빗한 공간이 필요한 사람들의 선택입니다. 회식, 모임, 특별한 날. 다른 사람 신경 쓰지 않고 우리끼리 즐기고 싶을 때 룸만 한 곳이 없습니다. 문을 닫으면 바깥 소음이 사라지고, 온전히 우리만의 시간이 시작됩니다. 전국 룸을 정리했습니다. 어디가 넓은지, 어디가 서비스 좋은지, 몇 명까지 수용 가능한지. 일산부터 해운대까지 독립 세팅 구성과 이용 안내를 한눈에 볼 수 있습니다. 단체 모임이나 비즈니스 접대를 앞두고 있다면, 여기서 미리 파악하세요. 공간이 바뀌면 분위기도 바뀝니다.',
    },
    yojeong: {
      title: `한정식 국악 풍류 현장 | ${SITE_NAME}`,
      description: '코스 요리와 판소리 공연이 어우러지는 곳. 사전 연락 요령과 에티켓 참고서.',
      heading: '한정식 국악, 풍류가 살아 있는 곳',
      intro: '한국 전통 문화를 경험하는 특별한 공간입니다. 15가지 한정식에 국악 라이브, 고급스러운 분위기. 접대, 비즈니스, 특별한 모임에 요정만 한 곳이 없습니다. 코스 요리가 하나씩 나올 때마다 판소리 가락이 함께 흐르고, 대화의 격도 자연스럽게 올라갑니다. 외국인 접대에도 강력한 인상을 남기는 공간입니다. 전국 요정을 정리했습니다. 사전 예약 방법, 에티켓, 코스 구성까지 미리 파악하면 처음이어도 당황하지 않습니다. 전통 접대 문화의 정수를 경험하고 싶다면 여기서 시작하세요.',
    },
    hoppa: {
      title: `여성 프리미엄 선택지 | ${SITE_NAME}`,
      description: '장안동·건대 매니저 시스템 해설과 첫 발걸음 준비물을 자료집으로 엮었습니다.',
      heading: '여성 프리미엄, 오늘 주인공은 당신',
      intro: '여성들이 편하게 즐기는 공간입니다. 친절한 호스트가 대화 상대가 되어주고, 술자리를 즐겁게 만들어줍니다. 처음이라 걱정되시나요? 걱정 마세요. 매니저 시스템과 무드를 미리 파악하고 가면 첫 발걸음도 한결 가볍습니다. 강남부터 부산까지, 분위기 좋은 곳만 모았습니다. 어떤 시스템인지, 어떤 분위기인지, 혼자 가도 괜찮은지. 궁금한 것들을 전부 정리했습니다. 생일 파티, 친구 모임, 혼자만의 특별한 저녁. 어떤 상황이든 맞는 곳을 찾을 수 있습니다. 오늘 밤 주인공은 당신입니다.',
    },
  };
  return data[catSlug] || data.club;
}

export function getHomeContent() {
  return {
    title: `밤키 — 110곳 비교 ${YEAR}`,
    description: `110곳 비교표. 6종 분류 ${YEAR} 현장 집계. 지역별 탑재.`,
    heading: '110곳 비교표',
    subheading: `플로어·테이블·바·독립석·풍류·호스트 ${YEAR}`,
  };
}
