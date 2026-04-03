import { getAllVenues } from '../src/lib/venues';
import fs from 'fs';

const CONTENT_MAP: Record<string, string> = {
  'cheongdam-h2o-night': 'h2o', 'sillim-grandprix-night': 'grandprix',
  'sangbong-hangukgwan-night': 'hangukgwan', 'suyu-shampoo-night': 'suyu-shampoo',
  'doksan-gukbingwan-night': 'gukbingwan', 'paju-yadang-skydome-night': 'yadang-skydome',
  'suwon-chancedom-night': 'chancedom', 'ulsan-champion-night': 'champion',
  'busan-yeonsandong-mul-night': 'monkey-beach', 'seongnam-shampoo-night': 'shampoo',
  'gangnam-club-race': 'race', 'gangnam-club-sound': 'sound',
  'gangnam-club-arte': 'arte', 'gangnam-club-face': 'face',
  'gangnam-club-jack': 'jack-livin', 'gangnam-club-utopia': 'suyu-checklist',
  'gangnam-club-miro': 'miro', 'gangnam-club-peak': 'purple',
  'gangnam-club-bamnbam': 'b1', 'cheongdam-club-arjou': 'arjou',
  'hongdae-club-bermuda': 'bermuda', 'itaewon-club-utopia': 'waikiki-utopia',
  'apgujeong-club-hype': 'hype', 'apgujeong-club-color': 'color',
  'apgujeong-club-muin': 'muin', 'apgujeong-club-intro': 'intro',
  'apgujeong-code-lounge': 'code', 'apgujeong-lounge-dm': 'dm',
  'incheon-arabian-night': 'arabian', 'daejeon-seven-night': 'seven',
  'daegu-babamba-night': 'babamba', 'busan-asiad-night': 'asiad',
  'busan-hoppa-aura': 'aura', 'gangnam-hoppa-blackhole': 'azit',
  'itaewon-gaepan-pocha': 'faust', 'hongdae-club-made': 'ff',
  'ilsan-club-cj': 'grid', 'incheon-paradise-city': 'groove',
  'seoul-banyan-tree': 'le-club', 'uijeongbu-arena': 'laser',
  'apgujeong-club-candyman': 'curtain', 'apgujeong-club-dbridge': 'ocean',
  'daejeon-seoltang-club': 'siena', 'itaewon-club-made': 'sabotage',
  'itaewon-club-prism': 'volnost', 'hongdae-club-dokkaebi': 'again',
  'hongdae-club-pacific': 'all-air', 'yongin-sageori-byeolbam': 'alvin-avenue',
  'yongsan-dragon-city': 'lululala', 'nowon-cheongchun-pocha': 'melt',
  'bucheon-club-paragon': 'octagon', 'cheongju-club-supermoon': 'park-hyatt',
  'gangnam-club-laputa': 'plus82', 'apgujeong-idiot-lounge': 'running-rabbit',
  'haeundae-hoppa-kkantappiya': 'sky-lounge', 'busan-hoppa-star': 'billie-jean',
  'busan-hoppa-menz': 'cakeshop',
};

function hasJong(s: string): boolean {
  const c = s.charCodeAt(s.length - 1);
  return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
}
const eN = (s: string) => hasJong(s) ? '은' : '는';
const eR = (s: string) => hasJong(s) ? '을' : '를';
const iG = (s: string) => hasJong(s) ? '이' : '가';

const catTone: Record<string, {arrive: string, peak: string, late: string, vibe: string}> = {
  night: {arrive: '로비를 지나 홀로 들어서면 무대 조명이 눈에 들어온다', peak: '자정이 넘어가면 테이블 사이로 열기가 올라온다', late: '새벽 3시, 마지막 무대가 끝나갈 무렵 여운이 남는다', vibe: '테이블 문화와 사교의 정석'},
  club: {arrive: '지하로 내려가는 순간 베이스가 발밑을 타고 올라온다', peak: '자정, DJ가 메인 트랙을 떨어뜨리면 플로어가 들끓는다', late: '새벽 4시, 에너지가 최고조에 달한다', vibe: '비트와 조명이 만드는 몰입의 공간'},
  lounge: {arrive: '문을 열면 은은한 재즈가 흘러나온다', peak: '밤 10시, 바 카운터가 채워지기 시작한다', late: '자정이 지나면 조용한 대화만 남는다', vibe: '대화가 되는 바, 분위기의 완성'},
  room: {arrive: '엘리베이터 문이 열리면 프라이빗한 복도가 펼쳐진다', peak: '모임이 무르익는 밤 9시', late: '새벽까지 이어지는 프라이빗한 시간', vibe: '문을 닫으면 우리만의 세계'},
  yojeong: {arrive: '한옥 대문을 열면 국악 선율이 은은하게 들린다', peak: '한정식 코스가 올라오고 가야금 연주가 시작된다', late: '밤이 깊어지면 풍류의 진면목이 드러난다', vibe: '전통과 격식이 살아있는 자리'},
  hoppa: {arrive: '엘리베이터에서 내리면 매니저가 먼저 인사한다', peak: '밤 11시, 분위기가 가장 뜨거워지는 시간', late: '새벽 2시, 매니저와의 대화가 깊어진다', vibe: '여성을 위한 프리미엄 선택지'},
};

const allV = getAllVenues();
const missing = allV.filter(v => !CONTENT_MAP[v.slug]);

let count = 0;
const newMapEntries: string[] = [];

for (const v of missing) {
  const cat = v.cat_slug;
  const tone = catTone[cat] || catTone.night;
  const nick = v.nickname || '담당자';
  const stn = v.station || '';
  const hrs = v.hours || '저녁~새벽';
  const hook = v.card_hook || v.name + '에서 특별한 밤을';
  const kw = v.keywords || [v.district, v.name];
  const tg = v.tags || [v.district];
  const addr = v.address || v.district;
  const stnText = stn || v.district + ' 인근';

  const content = {
    slug: v.slug,
    heroTagline: hook,
    introHook: `${v.name}, ${v.district}에서 시작되는 밤의 이야기`,
    introBullets: [
      `${addr}${stn ? ', ' + stn + ' 도보권' : ''}`,
      `${hrs} 운영${nick !== '담당자' ? ', ' + nick + ' 상담' : ''}`,
      tg.slice(0, 3).join(' · ')
    ],
    introTeaser: `${v.district}의 밤이 시작되는 곳. ${v.name}${eN(v.name)} ${hook}. ${stnText}에서 가까운 이곳은 ${v.region} 밤 문화를 논할 때 빠지지 않는 이름이다.`,
    prologueTitle: `${v.district}의 밤, ${v.name}으로 향하다`,
    prologue: `<p>${v.district}. ${stnText}에서 내려 ${v.name} 방향으로 걸으면 ${v.district} 특유의 밤거리가 펼쳐진다. ${tone.arrive}. ${v.name}의 간판이 보이는 순간, 오늘 밤의 무대가 시작된다. ${nick !== '담당자' ? nick + '에게 미리 연락했다면 입구에서 바로 안내를 받을 수 있다.' : '입구에서 잠시 기다리면 안내를 받을 수 있다.'}</p>`,
    scene1Title: `${v.name}, 피크타임의 현장`,
    scene1: `<p>${tone.peak}. ${v.name}의 진면목이 드러나는 순간이다. ${v.district}에서 ${v.name}${eR(v.name)} 찾는 사람들은 바로 이 시간대를 목표로 온다. ${kw[0] || v.district} 특유의 에너지가 공간 전체를 채운다. ${v.name}만의 분위기는 글로 설명하기 어렵다. 직접 와봐야 안다.</p>`,
    scene2Title: `밤이 깊어지면, ${v.name}의 다른 얼굴`,
    scene2: `<p>${tone.late}. ${v.name}의 분위기는 시간대마다 달라진다. 초반의 설렘과 피크의 열기를 지나 ${v.district}의 새벽이 찾아오면, ${v.name}만의 여운이 남는다. ${nick !== '담당자' ? nick + '이 마지막까지 챙겨주니 편하게 즐기면 된다.' : '마지막까지 편하게 즐기면 된다.'}</p>`,
    tipTitle: `${v.name} 방문 꿀팁`,
    tipSection: `<h3>${v.name} 방문 전 알아둘 것</h3><p>${nick !== '담당자' ? v.name + '에 처음 온다면 ' + nick + '에게 전화부터 하자.' : v.name + ' 방문 전 전화 한 통이면 된다.'} 신분증은 필수. ${stn ? stn + '에서 오면 접근이 편하고, ' : ''}${hrs}에 운영하니 시간 맞춰 출발하자. ${v.district} 근처 맛집에서 저녁 먹고 오면 동선이 완벽해진다.</p><h3>자리 선택 팁</h3><p>${v.name}에서는 일찍 도착할수록 좋은 자리를 잡을 수 있다. ${kw[1] || '분위기'}${iG(kw[1] || '분위기')} 핵심인 곳이니 여유 있게 즐기자.</p>`,
    dialogueTitle: `${v.name}${eR(v.name)} 다녀온 솔직 후기`,
    dialogueSection: `<p>"${v.name} 가봤어?" "${v.district}에 그런 데가 있어?" "야, 진짜 가봐. ${hook}." ${v.district} 주민이라면 한 번쯤 들어봤을 이 대화. ${v.name}${eN(v.name)} 직접 가봐야 왜 이런 소문이 나는지 알 수 있다.${nick !== '담당자' ? ' ' + nick + '한테 연락하면 처음이어도 편하게 안내받을 수 있다.' : ''}</p>`,
    checklistTitle: `${v.name} 방문 전 체크리스트`,
    checklist: [
      '신분증(주민등록증·운전면허증·여권) 소지 확인',
      nick !== '담당자' ? `${nick}에게 사전 연락 완료` : '방문 전 전화 문의 완료',
      stn ? `${stn} 교통편 확인` : '교통편(택시/대중교통) 확인',
      '당일 복장 점검 (깔끔한 캐주얼 이상)',
      `${v.district} 근처 저녁 식사 장소 확보`,
      '귀가 방법(대리운전/택시) 사전 준비'
    ],
    faqItems: [
      {q: `${v.name} 위치가 어디인가요?`, a: `${addr}에 위치합니다.${stn ? ' ' + stn + '에서 접근 가능합니다.' : ''}`},
      {q: `${v.name} 영업시간이 어떻게 되나요?`, a: `${hrs}에 운영합니다. 요일이나 시즌에 따라 변동 가능하니 방문 전 확인하세요.`},
      {q: '예약이 필요한가요?', a: nick !== '담당자' ? `${nick}에게 미리 연락하면 원활한 방문이 가능합니다.` : '전화로 사전 문의하면 편리합니다.'},
      {q: `${v.name}만의 특징은 무엇인가요?`, a: `${hook}. ${tg.slice(0, 2).join(', ')} 등이 ${v.name}의 핵심 매력입니다.`},
      {q: '1인 방문도 괜찮은가요?', a: cat === 'hoppa' ? '물론이다. 혼자 오는 분도 많고 매니저가 처음부터 끝까지 챙겨준다.' : '바 카운터에 앉으면 혼자서도 자연스럽게 분위기에 녹아든다.'}
    ],
    outroTitle: `${v.name}에서 보낸 밤을 돌아보며`,
    outro: `<p>${v.name}${eN(v.name)} ${v.district}에서 ${tone.vibe}를 보여주는 곳이다. ${hook}. ${stnText}에서 가까운 접근성, ${hrs} 운영, 그리고 ${v.district}만의 분위기가 하나로 어우러진다. ${nick !== '담당자' ? nick + '에게 연락하면 첫 방문도 편안하게 시작할 수 있다.' : '전화 한 통이면 모든 준비가 끝난다.'} ${v.name}, 직접 와봐야 안다.</p>`,
    aiSummary: [
      `${v.name}, ${addr}`,
      stn ? `${stn} 도보권` : `${v.district} 소재`,
      `영업: ${hrs}`,
      tone.vibe,
      nick !== '담당자' ? `문의: ${nick}` : '전화 문의 가능'
    ],
    quickPlan: {decisionTable: [
      {label: '도착 시간', optionA: '오픈 직후 — 여유롭게 자리 선점', optionB: '피크타임 — 가장 뜨거운 분위기 직행'},
      {label: '교통수단', optionA: stn ? `${stn} 대중교통` : '택시 이용', optionB: '대리운전 예약'},
    ]}
  };

  const filePath = `src/data/venue-content/${v.slug}.json`;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  newMapEntries.push(`  '${v.slug}': '${v.slug}',`);
  count++;
}

console.log(`Generated: ${count} files`);
console.log('\nNew CONTENT_MAP entries:');
for (const m of newMapEntries) console.log(m);
