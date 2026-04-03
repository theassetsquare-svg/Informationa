#!/usr/bin/env node
/**
 * generate-missing-content.js
 * Generates unique venue-content JSON files for venues that don't have custom content yet.
 * Run: node scripts/generate-missing-content.js
 */

const fs = require('fs');
const path = require('path');

const VENUES_PATH = path.resolve(__dirname, '../src/data/venues.json');
const CONTENT_DIR = path.resolve(__dirname, '../src/data/venue-content');

// Current CONTENT_MAP from page.tsx — venues that already have content
const EXISTING_MAP = {
  'cheongdam-h2o-night': 'h2o',
  'sillim-grandprix-night': 'grandprix',
  'sangbong-hangukgwan-night': 'hangukgwan',
  'suyu-shampoo-night': 'suyu-shampoo',
  'doksan-gukbingwan-night': 'gukbingwan',
  'paju-yadang-skydome-night': 'yadang-skydome',
  'suwon-chancedom-night': 'chancedom',
  'ulsan-champion-night': 'champion',
  'busan-yeonsandong-mul-night': 'monkey-beach',
  'seongnam-shampoo-night': 'shampoo',
  'gangnam-club-race': 'race',
  'gangnam-club-sound': 'sound',
  'gangnam-club-arte': 'arte',
  'gangnam-club-face': 'face',
  'gangnam-club-jack': 'jack-livin',
  'gangnam-club-utopia': 'suyu-checklist',
  'gangnam-club-miro': 'miro',
  'gangnam-club-peak': 'purple',
  'gangnam-club-bamnbam': 'b1',
  'cheongdam-club-arjou': 'arjou',
  'hongdae-club-bermuda': 'bermuda',
  'itaewon-club-utopia': 'waikiki-utopia',
  'apgujeong-club-hype': 'hype',
  'apgujeong-club-color': 'color',
  'apgujeong-club-muin': 'muin',
  'apgujeong-club-intro': 'intro',
  'apgujeong-code-lounge': 'code',
  'apgujeong-lounge-dm': 'dm',
  'incheon-arabian-night': 'arabian',
  'daejeon-seven-night': 'seven',
  'daegu-babamba-night': 'babamba',
  'busan-asiad-night': 'asiad',
  'busan-hoppa-aura': 'aura',
  'gangnam-hoppa-blackhole': 'azit',
  'itaewon-gaepan-pocha': 'faust',
  'hongdae-club-made': 'ff',
  'ilsan-club-cj': 'grid',
  'incheon-paradise-city': 'groove',
  'seoul-banyan-tree': 'le-club',
  'uijeongbu-arena': 'laser',
  'apgujeong-club-candyman': 'curtain',
  'apgujeong-club-dbridge': 'ocean',
  'daejeon-seoltang-club': 'siena',
  'itaewon-club-made': 'sabotage',
  'itaewon-club-prism': 'volnost',
  'hongdae-club-dokkaebi': 'again',
  'hongdae-club-pacific': 'all-air',
  'yongin-sageori-byeolbam': 'alvin-avenue',
  'yongsan-dragon-city': 'lululala',
  'nowon-cheongchun-pocha': 'melt',
  'bucheon-club-paragon': 'octagon',
  'cheongju-club-supermoon': 'park-hyatt',
  'gangnam-club-laputa': 'plus82',
  'apgujeong-idiot-lounge': 'running-rabbit',
  'haeundae-hoppa-kkantappiya': 'sky-lounge',
  'busan-hoppa-star': 'billie-jean',
  'busan-hoppa-menz': 'cakeshop',
};

// ── Category-specific vocabulary pools ──────────────────────────────
const CAT_VOCAB = {
  night: {
    placeWords: ['나이트', '나이트클럽', '클럽', '댄스홀'],
    actions: ['춤을 추다', '스텝을 밟다', '리듬에 몸을 맡기다', '플로어를 달구다'],
    vibes: ['열기', '에너지', '흥', '분위기', '리듬감', '박자'],
    peakDescriptions: ['DJ가 믹싱을 올리고 조명이 빠르게 돌아간다', '플로어 중앙에 서면 사방에서 비트가 밀려온다', '무대 조명이 천장을 가로지르며 열기가 최고조에 달한다'],
    lateDescriptions: ['새벽 공기가 달라진다', '마지막 슬로우 곡이 흐른다', '플로어에 남은 이들만의 시간이 시작된다'],
    arrivalVerbs: ['문을 열고 들어서다', '계단을 내려가다', '입구를 지나다', '로비를 통과하다'],
    tipPhrases: ['웨이팅 없이 입장하려면', '복장은 깔끔하게', '신분증은 필수다'],
  },
  club: {
    placeWords: ['클럽', '베뉴', '파티 공간', '사운드 바'],
    actions: ['비트에 맞춰 뛰다', '바이브를 타다', '세트를 즐기다', 'DJ와 호흡을 맞추다'],
    vibes: ['사운드', '베이스', '드롭', '그루브', '바이브', '에너지'],
    peakDescriptions: ['첫 드롭이 떨어지는 순간 플로어가 하나가 된다', 'LED가 비트에 맞춰 펄스를 쏘아올린다', '우퍼에서 나오는 저음이 가슴을 흔든다'],
    lateDescriptions: ['마감 세트의 멜로디가 깊어진다', '클로징 DJ가 마지막 트랙을 올린다', '조명이 한 톤 내려가고 남은 사람들만의 공간이 된다'],
    arrivalVerbs: ['지하로 내려서다', '문이 열리다', '입구를 통과하다', 'ID 체크를 마치다'],
    tipPhrases: ['게스트 등록을 미리 해두면', '편한 신발이 필수', '카카오 채널 추가가 이득'],
  },
  room: {
    placeWords: ['룸', '룸살롱', '프라이빗 룸', '접대 공간'],
    actions: ['자리를 잡다', '잔을 기울이다', '건배를 올리다', '대화가 깊어지다'],
    vibes: ['격식', '분위기', '프라이버시', '서비스', '품격', '여유'],
    peakDescriptions: ['문을 닫으면 바깥 소리가 완전히 차단된다', '전담 매니저가 테이블 세팅을 마친다', '첫 건배가 끝나면 대화의 밀도가 달라진다'],
    lateDescriptions: ['자정이 지나면 대화가 본론으로 들어간다', '새벽 공기 속에서 마지막 잔을 비운다', '룸 조명이 한층 부드러워지며 마무리 분위기로 전환된다'],
    arrivalVerbs: ['건물에 도착하다', '엘리베이터를 타다', '안내를 받아 룸으로 이동하다', '발렛을 맡기다'],
    tipPhrases: ['예약은 최소 하루 전에', '복장은 비즈니스 캐주얼 이상', '코스 메뉴를 미리 확인하면 좋다'],
  },
  yojeong: {
    placeWords: ['요정', '전통 요정', '한정식 요정', '풍류의 공간'],
    actions: ['풍류를 즐기다', '국악에 귀 기울이다', '한정식을 음미하다', '전통 자리를 마련하다'],
    vibes: ['풍류', '전통', '격조', '운치', '정취', '품격'],
    peakDescriptions: ['가야금 선율이 방 안을 채운다', '한정식 코스가 하나씩 올라오며 대화가 무르익는다', '국악 공연이 시작되면 분위기가 절정에 이른다'],
    lateDescriptions: ['마지막 코스가 올라오며 자리가 정돈된다', '풍류의 여운이 길게 남는다', '뒤뜰 정원에서 마무리 차를 마신다'],
    arrivalVerbs: ['대문을 열다', '마당을 지나다', '안내를 받아 방으로 들어서다', '한옥 처마 아래를 지나다'],
    tipPhrases: ['코스 요리는 사전 예약 필수', '전통 한복 착용 시 할인', '국악 공연 시간을 확인하라'],
  },
  hoppa: {
    placeWords: ['호빠', '호스트바', '호스트클럽', '프리미엄 호빠'],
    actions: ['분위기를 즐기다', '서비스를 받다', '대화를 나누다', '특별한 밤을 보내다'],
    vibes: ['설렘', '서비스', '분위기', '매력', '케미', '화려함'],
    peakDescriptions: ['선택한 호스트가 자리에 앉으며 대화가 시작된다', '시그니처 세트가 올라오고 분위기가 달아오른다', '조명이 바뀌면서 쇼타임이 시작된다'],
    lateDescriptions: ['새벽 시간대는 단골만 아는 조용한 타임', '마감 시간이 가까워지면 라스트 오더가 돌아간다', '마지막 곡이 흐르면서 밤의 여운이 남는다'],
    arrivalVerbs: ['문을 열고 들어서다', '로비에서 안내를 받다', '엘리베이터를 타고 올라가다', '매니저의 안내로 자리에 앉다'],
    tipPhrases: ['첫 방문이면 매니저에게 취향을 말해라', '세트 가격을 미리 확인하라', '예약하면 대기 없이 입장 가능'],
  },
  lounge: {
    placeWords: ['라운지', '프리미엄 라운지', '바 라운지', 'VIP 라운지'],
    actions: ['칵테일을 음미하다', '소파에 몸을 맡기다', '대화에 빠지다', '분위기를 만끽하다'],
    vibes: ['무드', '은은함', '세련됨', '고급감', '여유', '분위기'],
    peakDescriptions: ['바텐더가 시그니처 칵테일을 내린다', '라운지 음악이 볼륨을 높이며 분위기가 전환된다', '테이블마다 촛불이 켜지고 대화가 깊어진다'],
    lateDescriptions: ['새벽 라운지는 조용하고 깊은 대화의 공간', '마지막 칵테일을 주문하며 밤을 정리한다', '은은한 재즈가 흐르며 클로징 무드가 된다'],
    arrivalVerbs: ['입구에 들어서다', '엘리베이터로 올라가다', '리셉션을 지나다', '소파 좌석으로 안내받다'],
    tipPhrases: ['드레스코드가 있으니 확인하라', '칵테일 메뉴를 미리 살펴보면 좋다', '예약 시 창가 자리를 요청할 수 있다'],
  },
};

// ── Unique phrase pools per section (rotated by venue index) ────────
const HERO_PREFIXES = [
  '', '이곳에서만 느낄 수 있는 ', '단골들이 인정한 ', '현지인만 아는 ',
  '소문난 ', '밤이 깊어질수록 빛나는 ', '한번 오면 다시 찾게 되는 ',
  '입소문만으로 채워지는 ', '직접 와봐야 아는 ', '경험자만 추천하는 ',
];

const PROLOGUE_OPENERS = [
  '저녁 바람이 불기 시작하는 시간',
  '해가 완전히 넘어간 뒤',
  '거리의 네온사인이 하나둘 켜질 때',
  '퇴근길 발걸음이 가벼워지는 시간',
  '약속 장소로 향하는 택시 안에서',
  '주말 저녁, 설레는 마음으로',
  '평일 밤, 일상을 벗어나고 싶을 때',
  '금요일 퇴근 후 가장 먼저 떠오르는 곳',
  '친구에게서 전화가 온 토요일 오후',
  '지도 앱을 켜고 검색창에 입력하는 순간',
];

const SCENE1_OPENERS = [
  '자정이 넘으면 분위기가 완전히 바뀐다.',
  '피크타임이 시작되면 공기부터 다르다.',
  '밤 12시, 모든 준비가 끝났다.',
  '새벽 1시가 되면 본격적인 시간이 시작된다.',
  '가장 뜨거운 시간대에 접어들면',
  '밤이 깊어질수록 열기는 올라간다.',
  '본 게임은 자정 이후부터다.',
  '사람들이 하나둘 모이기 시작하면',
  '오늘 밤의 하이라이트가 다가온다.',
  '시계를 보면 어느새 새벽 1시다.',
];

const SCENE2_OPENERS = [
  '새벽 3시가 지나면 분위기가 전환된다.',
  '밤의 마지막 챕터가 시작된다.',
  '마감 시간이 다가올수록 여운이 깊어진다.',
  '새벽 공기가 달라지는 시간.',
  '끝까지 남은 사람들만의 시간이다.',
  '라스트 타임은 언제나 특별하다.',
  '시계 바늘이 새벽 4시를 가리킬 때.',
  '밤의 끝자락에서 만나는 고요함.',
  '마지막 곡이 흐르기 시작한다.',
  '새벽빛이 스며들기 직전의 순간.',
];

const DIALOGUE_STARTERS = [
  '직장 동료가 월요일에 물었다.',
  '친구가 카톡으로 물어왔다.',
  '후배가 점심시간에 슬쩍 물었다.',
  '회식 자리에서 누군가 꺼낸 이야기.',
  '택시 안에서 친구에게 들은 이야기.',
  '동네 형이 퇴근길에 슬쩍 말했다.',
  '인스타 DM으로 물어본 친구가 있었다.',
  '주말 아침, 같이 간 일행이 말했다.',
  '대학 동기가 오랜만에 연락했다.',
  '블로그 댓글에 누군가 물었다.',
];

const OUTRO_CLOSERS = [
  '다시 올 이유가 생긴 밤이다.',
  '이 밤을 기억하게 될 것이다.',
  '문을 나서며 다음 방문을 약속한다.',
  '돌아가는 길, 여운이 길게 남는다.',
  '이곳의 밤은 끝나도 기억은 남는다.',
  '다음에는 누구를 데려올지 이미 정했다.',
  '일상으로 돌아가도 이 밤은 선명하다.',
  '또 올 거냐는 질문에 고개를 끄덕인다.',
  '새벽 공기를 마시며 미소가 번진다.',
  '이 동네의 밤을 제대로 경험한 셈이다.',
];

// ── Helpers ─────────────────────────────────────────────────────────

function pick(arr, idx) {
  return arr[idx % arr.length];
}

function pickN(arr, n, startIdx) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(arr[(startIdx + i) % arr.length]);
  }
  return result;
}

function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function loc(v) {
  if (v.address) return v.address;
  if (v.station) return `${v.station} 인근`;
  return `${v.district} 지역`;
}

function stationInfo(v) {
  if (v.station) return `${v.station}에서 가까운 거리`;
  return `${v.district} 중심가 접근성 좋은 위치`;
}

function hoursInfo(v) {
  if (v.hours) return v.hours;
  const catDefaults = {
    night: '저녁 9시부터 새벽까지',
    club: '밤 10시부터 새벽 6시까지',
    room: '저녁 7시부터 새벽 2시까지',
    yojeong: '오후 5시부터 자정까지',
    hoppa: '저녁 8시부터 새벽 3시까지',
    lounge: '저녁 7시부터 새벽 2시까지',
  };
  return catDefaults[v.cat_slug] || '저녁부터 새벽까지';
}

function contactInfo(v) {
  if (v.nickname && v.nickname_phone) return `${v.nickname} ${v.nickname_phone}`;
  if (v.nickname) return `담당: ${v.nickname}`;
  return '';
}

function tagsStr(v) {
  return (v.tags || []).join(', ');
}

function keywordsStr(v) {
  return (v.keywords || []).join(' ');
}

// ── Content Generation ──────────────────────────────────────────────

function generateContent(v, globalIdx) {
  const cat = v.cat_slug;
  const vocab = CAT_VOCAB[cat] || CAT_VOCAB.night;
  const h = hashStr(v.slug);
  const idx = globalIdx;
  const name = v.name;
  const district = v.district;
  const region = v.region;
  const tags = v.tags || [];
  const keywords = v.keywords || [];
  const seoExtra = v.seo_extra || '';
  const cardHook = v.card_hook || `${district}에서 만나는 특별한 밤`;
  const hours = hoursInfo(v);
  const location = loc(v);
  const station = stationInfo(v);
  const contact = contactInfo(v);
  const nick = v.nickname || '';

  // heroTagline: based on card_hook
  const heroTagline = cardHook;

  // introHook
  const introHook = `${name}은 ${district} ${pick(vocab.placeWords, idx)} 중에서도 ${pick(vocab.vibes, idx)}이 남다른 곳이다`;

  // introBullets — 3 unique bullets
  const introBullets = [
    `${station}, ${location}에 자리한 ${name}`,
    `${hours} 운영, ${tags.length > 0 ? tags[0] : vocab.placeWords[0]} 전문`,
    `${seoExtra || `${district}에서 ${pick(vocab.vibes, idx + 1)}을 찾는다면 여기가 답이다`}`,
  ];

  // introTeaser
  const introTeaser = `${pick(PROLOGUE_OPENERS, idx)}, ${district}으로 향하는 발걸음이 빨라진다. ${name}의 문 앞에 서면 안쪽에서 ${pick(vocab.vibes, idx + 2)}이 새어 나온다. 오늘 밤, ${name}에서 보낼 시간을 상상하면 이미 설렌다.`;

  // prologueTitle
  const prologueTitleOptions = [
    `${name}으로 향하는 첫걸음`,
    `${district}의 밤, ${name}에서 시작하다`,
    `${name}의 문을 여는 순간`,
    `${district} 한복판에서 만나는 ${name}`,
    `${name}, 첫인상이 말해주는 것들`,
    `오늘 밤의 목적지, ${name}`,
    `${region}에서 ${name}까지`,
    `${name}을 찾아가는 길`,
    `${district}의 숨은 공간, ${name}`,
    `${name}에 도착한 순간`,
  ];
  const prologueTitle = pick(prologueTitleOptions, idx);

  // prologue — 200+ chars, venue-specific
  const prologue = `<p>${pick(PROLOGUE_OPENERS, idx + 3)}, ${district}으로 향한다. ${v.station ? `${v.station}을 지나` : `${district} 중심가를 걸으며`} ${pick(vocab.arrivalVerbs, idx)}. ${name}의 입구가 보이는 순간부터 분위기가 달라진다. ${pick(vocab.arrivalVerbs, idx + 1)}면 ${pick(vocab.vibes, idx)}이 온몸을 감싼다. ${name}은 ${district}에서 ${pick(vocab.placeWords, idx)}을 찾는 사람이라면 반드시 한 번은 들러야 할 곳이다. ${seoExtra ? seoExtra : `${region} 일대에서 ${pick(vocab.vibes, idx + 1)}으로 소문난 이 공간은 처음 방문해도 금세 편안해진다.`} 안으로 깊숙이 들어갈수록 ${pick(vocab.vibes, idx + 2)}이 짙어지고, 이 밤이 특별할 거라는 예감이 확신으로 바뀐다.</p>`;

  // scene1Title
  const scene1TitleOptions = [
    `${name}의 피크타임, 가장 뜨거운 순간`,
    `한밤중 ${name}에서 벌어지는 일`,
    `${name}이 가장 빛나는 시간`,
    `자정 이후, ${name}의 진짜 모습`,
    `${district}의 밤이 달아오르는 시간`,
    `${name} 피크타임 완전 가이드`,
    `열기가 최고조에 달하는 ${name}`,
    `${name}에서 만나는 한밤의 에너지`,
    `밤 12시, ${name}의 온도가 올라간다`,
    `${name}의 하이라이트는 바로 이 시간`,
  ];
  const scene1Title = pick(scene1TitleOptions, idx);

  // scene1 — 200+ chars
  const scene1 = `<p>${pick(SCENE1_OPENERS, idx)} ${name}의 내부는 ${pick(vocab.vibes, idx + 3)}으로 가득 찬다. ${pick(vocab.peakDescriptions, idx)} ${name}에서 ${pick(vocab.actions, idx)}는 건 단순한 유흥이 아니다. ${district}에서 ${tags.length > 0 ? tags[0] : vocab.placeWords[0]}을 제대로 즐기려면 바로 이 시간대를 노려야 한다. ${name}의 피크타임은 ${hours.includes('~') ? hours.split('~')[0].trim() + ' 이후' : '자정 무렵'}부터 시작되며, 한번 올라간 ${pick(vocab.vibes, idx + 1)}은 쉽게 내려오지 않는다. ${pick(vocab.actions, idx + 1)}는 사람들 사이에서 ${name}만의 고유한 리듬이 만들어진다.</p>`;

  // scene2Title
  const scene2TitleOptions = [
    `새벽, ${name}의 마지막 장면`,
    `${name}에서 보내는 새벽의 여운`,
    `밤의 끝에서 만나는 ${name}`,
    `${name} 마감 시간의 분위기`,
    `새벽빛 아래 ${name}을 나서며`,
    `${name}의 라스트 타임`,
    `${district}의 새벽, ${name}에서 마무리`,
    `마지막까지 남은 사람들의 ${name}`,
    `${name}을 떠나기 직전의 순간`,
    `새벽 공기와 함께하는 ${name}의 엔딩`,
  ];
  const scene2Title = pick(scene2TitleOptions, idx);

  // scene2 — 200+ chars
  const scene2 = `<p>${pick(SCENE2_OPENERS, idx)} ${name}의 ${pick(vocab.vibes, idx + 4)}이 한 톤 부드러워진다. ${pick(vocab.lateDescriptions, idx)} ${name}에서 마지막까지 남는 건 이 공간을 진짜 좋아하는 사람들이다. ${district}의 새벽 공기가 창 너머로 느껴질 무렵, ${name}의 마감은 단순한 끝이 아니라 다음 방문의 시작이 된다. ${pick(vocab.actions, idx + 2)}며 보낸 시간들이 머릿속에 선명하게 남는다. 문을 나서면서 ${pick(OUTRO_CLOSERS, idx + 5)}</p>`;

  // tipTitle
  const tipTitle = `${name} 꿀팁 모음`;

  // tipSection — venue-specific
  const tipItems = [];
  tipItems.push(`${name}에 처음 방문한다면 ${pick(vocab.tipPhrases, idx)}. `);
  if (contact) tipItems.push(`예약 및 문의는 ${contact}으로 하면 된다. `);
  tipItems.push(`${hours} 운영이니 시간을 맞춰서 방문하자. `);
  tipItems.push(`${station}이므로 대중교통 이용이 편리하다. `);
  if (tags.length > 0) tipItems.push(`${tags.join(', ')} 관련 정보는 방문 전 미리 확인하는 것이 좋다. `);
  tipItems.push(`${district}에서 ${pick(vocab.placeWords, idx)}을 찾는다면 ${name}을 리스트에 넣어 두자.`);

  const tipSection = `<h3>${name} 방문 전 반드시 알아야 할 것들</h3><p>${tipItems.join('')}</p>`;

  // dialogueTitle
  const dialogueTitle = `${name}을 다녀온 후기`;

  // dialogueSection
  const dialogueSection = `<p>"${pick(DIALOGUE_STARTERS, idx)} \\"${name} 가봤어?\\"" "응, ${pick(PROLOGUE_OPENERS, idx + 5).replace(/,?\s*$/, '')}에 갔는데 ${pick(vocab.vibes, idx)}이 장난 아니더라." "${district}에 그런 데가 있어?" "입소문으로만 도는 곳이야. ${seoExtra || `${name}은 한번 가면 단골 되는 곳이라더라.`}" "${name} 비싸지 않아?" "${pick(vocab.tipPhrases, idx + 1)}. ${nick ? nick + '한테 미리 연락하면 편해.' : '미리 알아보고 가면 훨씬 좋아.'}"</p>`;

  // checklistTitle
  const checklistTitle = `${name} 방문 전 체크리스트`;

  // checklist — 5 unique items
  const allCheckItems = shuffle([
    `${name} 영업시간(${hours})을 확인했는가`,
    `${station}까지의 이동 경로를 확인했는가`,
    `${v.cat_slug === 'night' || v.cat_slug === 'club' ? '신분증 원본을 소지했는가' : '예약을 완료했는가'}`,
    `${district} 주변 주차장 또는 대중교통을 확인했는가`,
    `동행자와 만남 장소 및 시간을 공유했는가`,
    `${pick(vocab.tipPhrases, idx + 2)}`,
    `핸드폰 충전 상태를 확인했는가`,
    `현금과 카드를 동시에 소지하고 있는가`,
    `${name} 관련 최신 공지사항을 확인했는가`,
    `${nick ? nick + '에게 사전 연락을 했는가' : '예약 여부를 확인했는가'}`,
    `귀가 수단(대리운전, 택시)을 미리 확보했는가`,
    `${tags.length > 0 ? tags[0] + ' 관련 복장 규정을 확인했는가' : '적절한 복장을 준비했는가'}`,
  ], h);
  const checklist = allCheckItems.slice(0, 5);

  // faqItems — venue-specific
  const faqItems = [
    {
      q: `${name}은 어디에 있나요?`,
      a: `${v.address ? v.address + '에 위치합니다.' : district + ' 지역에 위치하며, ' + station + '입니다.'}${v.map_url ? ' 지도 검색으로 정확한 위치를 확인하세요.' : ''}`
    },
    {
      q: `${name} 영업시간이 궁금합니다`,
      a: `${hours}으로 운영됩니다. 방문 전 공식 채널에서 당일 운영 여부를 확인하시길 권합니다.`
    },
    {
      q: `${name}에 예약 없이 갈 수 있나요?`,
      a: `${cat === 'room' || cat === 'yojeong' ? '사전 예약을 권장합니다.' : '예약 없이 방문 가능하지만, 주말 피크타임에는 대기가 있을 수 있습니다.'}${nick ? ` ${nick}에게 사전 문의하면 더 원활합니다.` : ''}`
    },
    {
      q: `${name}의 가격대는 어떤가요?`,
      a: `${v.card_value ? v.card_value + '입니다.' : '방문 시점과 이용 내용에 따라 달라지므로 사전 문의를 추천합니다.'}${nick ? ` ${nick} 연락처로 문의하세요.` : ''}`
    },
    {
      q: `${name}에 주차가 가능한가요?`,
      a: `${district} 지역 특성상 주변 유료 주차장을 이용하거나 대중교통을 추천합니다.${v.station ? ` ${v.station} 이용이 가장 편리합니다.` : ''}`
    },
    {
      q: `${name}은 어떤 분위기인가요?`,
      a: `${seoExtra || `${district}에서 ${pick(vocab.vibes, idx)}을 제대로 경험할 수 있는 ${pick(vocab.placeWords, idx)}입니다.`}`
    },
    {
      q: `${name}에 혼자 가도 되나요?`,
      a: `${cat === 'hoppa' ? '혼자 방문하는 분도 많으며 매니저가 안내해줍니다.' : cat === 'room' || cat === 'yojeong' ? '소규모 모임부터 가능하니 사전 문의하시길 바랍니다.' : '혼자 방문하는 분들도 많습니다. 바 좌석이나 스탠딩 구역을 추천합니다.'}`
    },
  ];

  // outroTitle
  const outroTitle = `${name}에서 보낸 밤`;

  // outro — 200+ chars
  const outro = `<p>${name}은 ${district}에서 ${pick(vocab.placeWords, idx)}을 찾는 사람들에게 확실한 선택지다. ${hours} 문을 여는 이곳에서 ${pick(vocab.vibes, idx)}을 경험하고 나면 ${district}의 밤에 대한 기준이 달라진다. ${seoExtra || `${region}을 대표하는 ${pick(vocab.placeWords, idx + 1)}으로서 ${name}은 매 방문마다 새로운 인상을 남긴다.`} ${pick(OUTRO_CLOSERS, idx)}</p>`;

  // aiSummary — 5 unique bullets
  const aiSummary = [
    `${district}에 위치한 ${name}, ${station}`,
    `영업시간: ${hours}`,
    `${tags.length > 0 ? tags.join(' · ') + ' 전문' : pick(vocab.placeWords, idx) + ' 전문'}`,
    `${seoExtra || `${region} 대표 ${pick(vocab.placeWords, idx)}`}`,
    `${nick ? `문의: ${contact}` : `${district} ${pick(vocab.placeWords, idx)} 중 추천 순위 상위`}`,
  ];

  // quickPlan
  const quickPlan = generateQuickPlan(v, vocab, idx);

  return {
    slug: v.slug,
    heroTagline,
    introHook,
    introBullets,
    introTeaser,
    prologueTitle,
    prologue,
    scene1Title,
    scene1,
    scene2Title,
    scene2,
    tipTitle,
    tipSection,
    dialogueTitle,
    dialogueSection,
    checklistTitle,
    checklist,
    faqItems,
    outroTitle,
    outro,
    aiSummary,
    quickPlan,
  };
}

function generateQuickPlan(v, vocab, idx) {
  const name = v.name;
  const district = v.district;
  const hours = hoursInfo(v);
  const station = stationInfo(v);
  const cat = v.cat_slug;

  // Decision table varies by category
  const decisionTables = {
    night: [
      { label: '도착 시간', optionA: `${hours.includes('9') ? '21:00' : '22:00'} — 여유로운 입장`, optionB: '자정 — 피크타임 합류' },
      { label: '교통수단', optionA: `${v.station ? v.station + ' 이용' : '대중교통'} — 편리한 접근`, optionB: '택시 — 빠른 도착' },
      { label: '자리 선택', optionA: '메인 플로어 — 분위기 중심', optionB: '바 카운터 — 여유로운 관람' },
    ],
    club: [
      { label: '도착 시간', optionA: '23:00 — 대기줄 없이 입장', optionB: '01:00 — 피크타임 바로 합류' },
      { label: '교통수단', optionA: `${v.station ? v.station + ' 도보' : '지하철'} 이용`, optionB: '택시 — 정문 하차' },
      { label: '자리 선택', optionA: '플로어 중앙 — 에너지 최대', optionB: 'VIP — 편안한 공간' },
    ],
    room: [
      { label: '예약 시간', optionA: '저녁 7시 — 식사부터 시작', optionB: '밤 10시 — 2차로 활용' },
      { label: '인원', optionA: '4~6인 — 소규모 프라이빗', optionB: '10인 이상 — 단체 접대' },
      { label: '코스 선택', optionA: '기본 코스 — 가성비 우선', optionB: '풀 코스 — 격식 있는 자리' },
    ],
    yojeong: [
      { label: '예약 시간', optionA: '오후 5시 — 한정식 코스부터', optionB: '저녁 7시 — 공연과 함께' },
      { label: '인원', optionA: '4~6인 — 소규모 풍류', optionB: '10인 이상 — 대규모 연회' },
      { label: '코스 선택', optionA: '한정식 기본 — 전통 맛 중심', optionB: '풀 코스 + 국악 — 완벽한 경험' },
    ],
    hoppa: [
      { label: '도착 시간', optionA: '저녁 9시 — 여유롭게 시작', optionB: '밤 11시 — 분위기 최고조' },
      { label: '이용 방식', optionA: '첫 방문 — 매니저 추천 의뢰', optionB: '단골 — 지명 예약' },
      { label: '세트 선택', optionA: '기본 세트 — 부담 없이', optionB: '프리미엄 세트 — 특별한 밤' },
    ],
    lounge: [
      { label: '도착 시간', optionA: '저녁 8시 — 차분한 시작', optionB: '밤 11시 — 무드 전환 타임' },
      { label: '좌석', optionA: '바 좌석 — 바텐더 추천 칵테일', optionB: '소파석 — 대화 중심' },
      { label: '음료', optionA: '시그니처 칵테일 — 이 집 대표', optionB: '위스키 — 조용한 시간' },
    ],
  };

  const scenarios = {
    night: [
      { title: `${district} 첫 방문 커플의 주말 밤`, desc: `${hours.split('~')[0] || '저녁'} 도착, 입장 후 메인홀에서 분위기 파악. 자정 무렵 플로어에서 본격적으로 즐기기.` },
      { title: `직장인 동료들의 2차`, desc: `${name}으로 이동해 음료 주문 후 플로어 합류. 새벽 2시 귀가.` },
      { title: `${district} 단골의 평일 방문`, desc: `평일 밤 여유롭게 입장, 바에서 음료 한 잔 후 느긋하게 즐기기.` },
    ],
    club: [
      { title: `${district} 첫 방문자의 금요일 밤`, desc: `23시 입장, 바에서 음료 한 잔 후 메인 플로어 합류. 새벽 3시 귀가.` },
      { title: `${district} 단골 5인의 주말`, desc: `VIP 테이블 예약, 보틀 세트 주문 후 전용 구역에서 즐기기.` },
      { title: `DJ 팬의 올나이트`, desc: `헤드라이너 세트 시간에 맞춰 입장, 클로징까지 완주.` },
    ],
    room: [
      { title: `비즈니스 접대 코스`, desc: `저녁 7시 코스 요리 시작, 대화와 함께 자연스러운 접대 진행.` },
      { title: `소규모 모임`, desc: `4~6인이 편안하게 즐기는 프라이빗 저녁 시간.` },
      { title: `기념일 특별 자리`, desc: `풀 코스 예약 후 조용한 룸에서 특별한 시간을 보내기.` },
    ],
    yojeong: [
      { title: `전통 풍류 체험`, desc: `오후 5시 한정식 시작, 국악 공연 감상 후 차 한 잔으로 마무리.` },
      { title: `비즈니스 연회`, desc: `대규모 인원 예약, 풀 코스와 공연으로 격식 있는 자리 진행.` },
      { title: `가족 모임`, desc: `한정식 코스를 중심으로 편안한 식사 시간.` },
    ],
    hoppa: [
      { title: `첫 방문 체험`, desc: `매니저 안내로 자리 배정, 기본 세트로 분위기 파악.` },
      { title: `친구들과 특별한 밤`, desc: `프리미엄 세트 예약, 지명 호스트와 함께 즐기기.` },
      { title: `${district} 단골의 주말`, desc: `단골 지명으로 바로 입장, 편안하게 즐기는 밤.` },
    ],
    lounge: [
      { title: `데이트 코스`, desc: `저녁 8시 도착, 시그니처 칵테일과 함께 분위기 있는 대화.` },
      { title: `혼자만의 시간`, desc: `바 좌석에서 바텐더 추천 음료를 음미하며 조용한 저녁.` },
      { title: `소규모 모임`, desc: `소파석 예약 후 친구들과 편안한 대화의 밤.` },
    ],
  };

  return {
    decisionTable: (decisionTables[cat] || decisionTables.night),
    scenarios: (scenarios[cat] || scenarios.night),
    costNote: v.card_value || '',
  };
}

// ── Main ────────────────────────────────────────────────────────────

function main() {
  const venues = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf8'));

  // Find venues not in EXISTING_MAP
  const missing = venues.filter(v => !(v.slug in EXISTING_MAP));

  console.log(`Total venues: ${venues.length}`);
  console.log(`Already mapped: ${Object.keys(EXISTING_MAP).length}`);
  console.log(`Missing (to generate): ${missing.length}`);
  console.log('');

  if (missing.length === 0) {
    console.log('No missing venues. Nothing to do.');
    return;
  }

  // Ensure output directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const generated = [];
  const contentMapEntries = [];

  missing.forEach((v, i) => {
    const content = generateContent(v, i);
    const filePath = path.join(CONTENT_DIR, `${v.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    generated.push(v.slug);
    contentMapEntries.push(`  '${v.slug}': '${v.slug}',`);
    console.log(`  [${i + 1}/${missing.length}] Generated: ${v.slug} (${v.name})`);
  });

  console.log('');
  console.log(`=== Generated ${generated.length} venue content files ===`);
  console.log('');
  console.log('Generated slugs:');
  generated.forEach(s => console.log(`  ${s}`));
  console.log('');
  console.log('=== CONTENT_MAP entries to add ===');
  console.log('');
  contentMapEntries.forEach(e => console.log(e));
  console.log('');
  console.log('Done!');
}

main();
