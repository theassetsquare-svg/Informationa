import type { Metadata } from 'next';
import { getAllVenues, getVenueBySlug, getRelatedVenues, SITE_URL, CAT_SLUG_TO_LABEL } from '../../../lib/venues';
import { generateGoldContent, SITE_NAME } from '../../../lib/gold-content';
import { loadVenueContent, stripHtml } from '../../../lib/venue-loader';
import { getVenueImage, getVenueBodyImages, getVenueGalleryImages } from '../../../lib/venue-images';
import VenueCard from '../../../components/VenueCard';
import StickyPhoneBar from '../../../components/StickyPhoneBar';
import StickyHighlight from '../../../components/StickyHighlight';
import { ViewCounter, SecretReveal, VsVote, DailyFortune, InfiniteRecommend, SwipeGallery, BeforeAfter, TimeAttack, ReviewHighlight, MiniMap } from '../../../components/EngagementSuite';

interface Props { params: { category: string; slug: string } }

/* ── slug → content slug 명시적 매핑 (1:1 관계, 중복 방지) ── */
const CONTENT_MAP: Record<string, string> = {
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
  'ilsan-room': 'ilsan-room',
  'haeundae-goguryeo': 'haeundae-goguryeo',
  'ilsan-myeongwolgwan-yojeong': 'ilsan-myeongwolgwan-yojeong',
  'gangnam-juliana-night': 'gangnam-juliana-night',
  'dapsimni-dontellmama-night': 'dapsimni-dontellmama-night',
  'gangseo-night': 'gangseo-night',
  'yeongdeungpo-terminal-night': 'yeongdeungpo-terminal-night',
  'nowon-hobak-night': 'nowon-hobak-night',
  'nowon-star-night': 'nowon-star-night',
  'gildong-chance-night': 'gildong-chance-night',
  'ilsan-shampoo-night': 'ilsan-shampoo-night',
  'ilsan-mul-night': 'ilsan-mul-night',
  'hwajeong-hangukgwan-night': 'hwajeong-hangukgwan-night',
  'gimpo-hobak-night': 'gimpo-hobak-night',
  'gimpo-sseom-night': 'gimpo-sseom-night',
  'guri-hobak-night': 'guri-hobak-night',
  'uijeongbu-hangukgwan-night': 'uijeongbu-hangukgwan-night',
  'suwon-korea-night': 'suwon-korea-night',
  'osan-hobak-night': 'osan-hobak-night',
  'seongnam-gukbingwan-night': 'seongnam-gukbingwan-night',
  'indeogwon-gukbingwan-night': 'indeogwon-gukbingwan-night',
  'bundang-pongpong-night': 'bundang-pongpong-night',
  'pyeongtaek-hobak-night': 'pyeongtaek-hobak-night',
  'bucheon-merit-night': 'bucheon-merit-night',
  'bucheon-gorae-night': 'bucheon-gorae-night',
  'ansan-hit-night': 'ansan-hit-night',
  'ansan-dontellmama-night': 'ansan-dontellmama-night',
  'cheonan-stardom-night': 'cheonan-stardom-night',
  'cheonan-korea-night': 'cheonan-korea-night',
  'daejeon-one-night': 'daejeon-one-night',
  'daejeon-bongmyeong-night': 'daejeon-bongmyeong-night',
  'daejeon-hangukgwan-night': 'daejeon-hangukgwan-night',
  'cheongju-dontellmama-night': 'cheongju-dontellmama-night',
  'cheongju-hobak-night': 'cheongju-hobak-night',
  'seosan-hobak-night': 'seosan-hobak-night',
  'daegu-hangukgwan-night': 'daegu-hangukgwan-night',
  'daegu-hobak-night': 'daegu-hobak-night',
  'daegu-totoga-night': 'daegu-totoga-night',
  'gumi-hobak-night': 'gumi-hobak-night',
  'busan-mul-night': 'busan-mul-night',
  'ulsan-newworld-night': 'ulsan-newworld-night',
  'gwangju-sangmu-night': 'gwangju-sangmu-night',
  'gwangju-totobam-night': 'gwangju-totobam-night',
  'gwangju-cheomdan-empa-night': 'gwangju-cheomdan-empa-night',
  'gwangju-mgm-night': 'gwangju-mgm-night',
  'gwangju-all-night': 'gwangju-all-night',
  'jeju-night': 'jeju-night',
  'gangnam-hoppa-royal': 'gangnam-hoppa-royal',
  'jangandong-hoppa-bbangbbang': 'jangandong-hoppa-bbangbbang',
  'geondae-hoppa-w': 'geondae-hoppa-w',
  'gangnam-hoppa-boston': 'gangnam-hoppa-boston',
  'suwon-hoppa-beast': 'suwon-hoppa-beast',
  'daejeon-hoppa-eclipse': 'daejeon-hoppa-eclipse',
  'sillim-hoppa-gungjon': 'sillim-hoppa-gungjon',
  'ulsan-hoppa-waltz': 'ulsan-hoppa-waltz',
  'jeonju-hoppa-gallery': 'jeonju-hoppa-gallery',
  'seomyeon-hoppa-first': 'seomyeon-hoppa-first',
};

function findContentSlug(venueSlug: string): string | null {
  return CONTENT_MAP[venueSlug] || null;
}

export function generateStaticParams() {
  return getAllVenues().map(v => ({ category: v.cat_slug, slug: v.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return { title: '페이지를 찾을 수 없습니다' };
  const allV = getAllVenues();
  const vIdx = allV.findIndex(v => v.slug === params.slug);
  const gc = generateGoldContent(venue, vIdx);
  const url = `${SITE_URL}/${venue.cat_slug}/${venue.slug}/`;
  return {
    title: gc.title,
    description: gc.description,
    alternates: { canonical: url },
    openGraph: {
      title: gc.title, description: gc.description, url,
      siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
      images: [{ url: gc.ogImage, width: 1200, height: 1200 }],
    },
    twitter: { card: 'summary_large_image', title: gc.title, description: gc.description, images: [gc.ogImage] },
  };
}

const catPaths: Record<string, string> = {
  club: '/clubs/', night: '/nights/', lounge: '/lounges/',
  room: '/rooms/', yojeong: '/yojeongs/', hoppa: '/hoppas/',
};


export default function VenueDetailPage({ params }: Props) {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return <div className="container section"><h1>페이지를 찾을 수 없습니다</h1></div>;

  const allV = getAllVenues();
  const vIdx = allV.findIndex(v => v.slug === venue.slug);
  const gc = generateGoldContent(venue, vIdx);
  const related = getRelatedVenues(venue, 3);
  const year = new Date().getFullYear();
  const catLabel = CAT_SLUG_TO_LABEL[venue.cat_slug] || venue.category;
  const catPath = catPaths[venue.cat_slug] || '/';
  const hasPhone = !!(venue.nickname && venue.nickname_phone);

  // venue-content JSON 로드 (고유 콘텐츠)
  const contentSlug = findContentSlug(venue.slug);
  const vc = contentSlug ? loadVenueContent(contentSlug) : null;

  // 카테고리 단어 필터 (키워드 스터핑 방지)
  const catWord = { club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' }[venue.cat_slug] || '';
  const filteredTags = venue.tags.filter(t => !t.includes(catWord) && t !== venue.category);
  const filteredCardTags = venue.card_tags.filter(t => !t.includes(catWord) && t !== venue.category);

  // FAQ: venue-content 있으면 사용, 없으면 gc.faq
  const faqItems = vc?.faqItems && vc.faqItems.length > 0 ? vc.faqItems : gc.faq;

  // 이미지
  const thumbSrc = getVenueImage(venue.cat_slug, venue.slug);
  const bodyImages = getVenueBodyImages(venue.cat_slug, venue.slug, 4);
  const galleryImages = getVenueGalleryImages(venue.cat_slug, venue.slug, 6);

  // 무한 추천용 같은 카테고리 업소
  const sameCatVenues = allV.filter(v => v.cat_slug === venue.cat_slug && v.slug !== venue.slug).slice(0, 15);

  // ═══ KEYWORD DENSITY CONTROLLER — target 1.5-2.5% ═══
  const _nEsc = venue.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const _nRe = new RegExp(_nEsc, 'g');
  const _nLen = venue.name.length;
  const _hJ = (s: string): boolean => { const c = s.charCodeAt(s.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0; };
  const _eN = _hJ(venue.name) ? '은' : '는';
  const _iG = _hJ(venue.name) ? '이' : '가';
  const _eR = _hJ(venue.name) ? '을' : '를';
  const _pn = _hJ(venue.name) ? '이곳' : '여기';

  // Collect ALL page text (without H2 name additions)
  const _tp: string[] = [venue.name, catLabel, venue.name, vc?.heroTagline || gc.tagline, venue.region];
  if (venue.hours) _tp.push(venue.hours);
  if (hasPhone) _tp.push(venue.nickname);
  if (vc) {
    [vc.prologue, vc.scene1, vc.scene2, vc.tipSection, vc.dialogueSection].forEach(s => s && _tp.push(stripHtml(s)));
    if (vc.checklist) _tp.push(vc.checklist.join(' '));
    if (vc.aiSummary) _tp.push(vc.aiSummary.join(' '));
    if (vc.outro) _tp.push(stripHtml(vc.outro));
  } else {
    _tp.push(gc.narrative, gc.guide.intro);
    gc.guide.tips.forEach(t => _tp.push(t));
    gc.tips.forEach(t => _tp.push(t));
  }
  faqItems.forEach(f => { _tp.push(f.q); _tp.push(typeof f.a === 'string' ? f.a : ''); });
  gc.timeSlots.forEach(t => _tp.push(`${t.time} ${t.level}`));
  _tp.push(venue.name); // comparison table header
  _tp.push('기본 정보', '자주 묻는 질문', '인기 시간대', '이 곳 vs 비슷한 곳', '사진 갤러리', '다음에 읽을 글');
  if (venue.address) _tp.push(venue.address);
  if (venue.station) _tp.push(venue.station);
  const _bt = _tp.join(' ');
  const _bc = (_bt.match(_nRe) || []).length;
  const _bl = _bt.length;

  // Determine H2 name count (max 3, reduce if density > 2.5%)
  let h2Count = 0;
  for (let n = 3; n >= 0; n--) {
    if (((_bc + n) * _nLen) / (_bl + n * (_nLen + 1)) * 100 <= 2.5) { h2Count = n; break; }
  }

  // Booster for VC pages (if total density < 1.5%)
  const vcBoosterTexts: string[] = [];
  let _rc = _bc + h2Count;
  let _rl = _bl + h2Count * (_nLen + 1);
  if (vc && (_rc * _nLen) / _rl * 100 < 1.5) {
    const _pool = [
      `${venue.name}${_eR} 검색해서 여기까지 왔다면, 이미 관심이 있다는 뜻이다. 직접 가보면 검색으로는 알 수 없던 현장 분위기를 체감하게 된다.`,
      `${venue.name} 방문 전에 전화 한 통 넣는 게 현명하다. 당일 상황이랑 좌석 여부를 바로 확인할 수 있다.`,
      `솔직히 ${venue.name}${_eN} 호불호가 갈릴 수 있다. 근데 직접 가보기 전에 판단하지 말자. 현장 분위기는 글로 전달하기 어렵다.`,
      `${venue.name}${_iG} 이 동네에서 이야기가 되는 건 다 이유가 있다. 와본 사람한테 물어보면 안다.`,
      `${venue.name}${_eN} 한 번 가본 사람이 다시 찾는다. 재방문율이 높다는 건 만족도가 높다는 거다.`,
      `${venue.name}${_eR} 처음 가는 거라면 주말보다 평일을 추천한다. 여유 있을 때 가야 제대로 즐긴다.`,
      `${venue.name}에서의 경험은 글로 전하기 어렵다. 분위기, 소리, 조명 — 직접 가봐야 안다.`,
      `${venue.name}에 한 번 가면 기준이 바뀐다. 다른 데 가면 비교하게 되니까.`,
      `${venue.name}${_eN} 사진보다 실물이 낫다. ${venue.district}에서 이 정도 공간감은 쉽게 찾기 어렵다.`,
      `${venue.name}에 갔다 온 사람들 후기가 하나같이 같다. "또 가고 싶다." 그 이유를 직접 확인해봐라.`,
    ];
    for (const p of _pool) {
      if ((_rc * _nLen) / _rl * 100 >= 1.5) break;
      const m = (p.match(_nRe) || []).length;
      if (((_rc + m) * _nLen) / (_rl + p.length) * 100 > 2.5) break;
      vcBoosterTexts.push(p);
      _rc += m;
      _rl += p.length;
    }
  }

  // Density diluter: when density > 2.5%, add non-name filler to bring it down
  const densityDiluterTexts: string[] = [];
  if ((_rc * _nLen) / _rl * 100 > 2.5) {
    const _dilPool = [
      `${venue.district}에서 이 정도 분위기를 갖춘 곳은 손에 꼽는다. 현장의 공기, 조명, 사운드가 ���들어내는 경���은 글로 전달하기 어렵다. 직접 가봐야 이해되는 종류다.`,
      `방문 전에 전화 한 통이면 당일 상황을 바로 파악할 수 있다. 좌석 여부, 대기 시간, 특별 이벤트까지 확인 가능하다. 이 5분이 ���패 없는 저녁을 만들어준다.`,
      `${venue.district} ��대는 저녁이 되면 분위기가 확 달라진다. 주변 ��권과 연계하면 1차부터 3차까지 자연스러운 동선이 만들어진다. ��사부터 시작하면 더 좋다.`,
      `신분��은 반드시 지참하자. 만 19�� 이상만 입장 가능하며, 주민등록증이나 운전면허증, 여권이 필요하다. 없으면 입장 자체가 불가능하다.`,
      `새벽 시간대에는 택시 잡기가 쉽지 않을 수 있다. 호출 앱을 미리 설치하거나 대리운전 번호를 저장해두면 귀가가 수월하다. ��중교통 막차 시간도 ���크하자.`,
      `처음 방문이라면 주말보다 평일을 추천한다. 여유 있을 때 가야 공간을 제대로 살펴볼 수 있고, 직원 응대도 한결 세심���진다. 편하게 즐기자.`,
    ];
    for (const p of _dilPool) {
      if ((_rc * _nLen) / _rl * 100 <= 2.5) break;
      const m = (p.match(_nRe) || []).length;
      densityDiluterTexts.push(p);
      _rc += m;
      _rl += p.length;
    }
  }

  // Density reducer: replace name with pronoun in body sections if > 2.5%
  let _surplus = ((_rc * _nLen) / _rl * 100 > 2.5) ? _rc - Math.max(2, Math.floor(_rl * 0.025 / _nLen)) : 0;
  const _rd = (html: string): string => {
    if (_surplus <= 0 || !html) return html;
    const pts = html.split(venue.name);
    if (pts.length <= 1) return html;
    const rm = Math.min(pts.length - 2, _surplus);
    _surplus -= rm;
    const kp = pts.length - 1 - rm;
    return pts.map((p, i) => i < pts.length - 1 ? p + (i < kp ? venue.name : _pn) : p).join('');
  };

  // JSON-LD
  const localBizLd = {
    '@context': 'https://schema.org', '@type': 'NightClub',
    name: venue.name,
    address: { '@type': 'PostalAddress', streetAddress: venue.address || undefined, addressLocality: venue.district, addressRegion: venue.region, addressCountry: 'KR' },
    openingHours: venue.hours || undefined,
    url: `${SITE_URL}/${venue.cat_slug}/${venue.slug}/`,
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: typeof f.a === 'string' ? f.a : '' },
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: catLabel, item: SITE_URL + catPath },
      { '@type': 'ListItem', position: 3, name: venue.name },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* 브레드크럼 */}
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span>
          <a href={catPath} target="_blank" rel="noopener noreferrer">{catLabel}</a>
          <span>&rsaquo;</span> {venue.name}
        </div>
      </div>

      {/* 히어로 */}
      <section className="detail-hero">
        <div className="container">
          {venue.badge && <span className="venue-card-badge" style={{ marginBottom: '0.75rem' }}>{venue.badge}</span>}
          <h1>{venue.name}</h1>
          <p className="detail-tagline">{vc?.heroTagline || gc.tagline}</p>
          {hasPhone && (
            <p style={{ color: '#4F46E5', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              담당: {venue.nickname}
            </p>
          )}
          <div className="detail-meta">
            <span>{venue.region}</span>
            {venue.hours && <span>{venue.hours}</span>}
          </div>

          {/* 히어로 썸네일 (1:1) — 다크 이미지 + 화이트 텍스트 오버레이 */}
          <div style={{ marginTop: '1.25rem', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src={thumbSrc}
              alt={venue.name}
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', background: '#E5E7EB', display: 'block' }}
              loading="eager"
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1rem 1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{venue.name}</span>
              {hasPhone && <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.25rem', opacity: 0.9 }}>담당: {venue.nickname}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* 읽는 시간 + 오늘 N명 카운터 + Time Attack */}
      <div className="container narrow">
        <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '1rem' }}>⏱</span> 읽는 시간: {Math.max(3, Math.round(_bl / 500))}분
        </div>
        <ViewCounter slug={venue.slug} />
        {hasPhone && <TimeAttack slug={venue.slug} />}
      </div>

      {/* ═══ 본문 — venue-content 있으면 고유 콘텐츠, 없으면 생성 콘텐츠 ═══ */}
      {vc ? (
        <>
          {/* 인트로 */}
          <section className="detail-section">
            <div className="container narrow">
              <h2>{vc.prologueTitle || `${year}년 방문 가이드`}</h2>
              <div dangerouslySetInnerHTML={{ __html: _rd(vc.prologue) }} />
            </div>
          </section>

          {/* 본문 이미지 1 */}
          <div className="container narrow" style={{ margin: '1.5rem auto' }}>
            <img src={bodyImages[0]} alt={venue.name} style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* 장면 1 */}
          {vc.scene1 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.scene1Title || '현장 스케치'}</h2>
                <div dangerouslySetInnerHTML={{ __html: _rd(vc.scene1) }} />
              </div>
            </section>
          )}

          {/* 본문 이미지 2 */}
          <div className="container narrow" style={{ margin: '1.5rem auto' }}>
            <img src={bodyImages[1]} alt={venue.name} style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* 장면 2 */}
          {vc.scene2 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.scene2Title || '더 알아야 할 것'}</h2>
                <div dangerouslySetInnerHTML={{ __html: _rd(vc.scene2) }} />
              </div>
            </section>
          )}

          {/* 실전 팁 */}
          {vc.tipSection && (
            <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
              <div className="container narrow">
                <h2>{vc.tipTitle || '실전 팁'}</h2>
                <div dangerouslySetInnerHTML={{ __html: _rd(vc.tipSection) }} />
              </div>
            </section>
          )}

          {/* 본문 이미지 3 */}
          <div className="container narrow" style={{ margin: '1.5rem auto' }}>
            <img src={bodyImages[2]} alt={venue.name} style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* 대화 */}
          {vc.dialogueSection && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.dialogueTitle || '이런 대화가 오간다'}</h2>
                <div dangerouslySetInnerHTML={{ __html: _rd(vc.dialogueSection) }} />
              </div>
            </section>
          )}

          {/* 체크리스트 */}
          {vc.checklist && vc.checklist.length > 0 && (
            <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
              <div className="container narrow">
                <h2>{vc.checklistTitle || '방문 전 체크리스트'}</h2>
                <ul className="checklist">
                  {vc.checklist.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </section>
          )}

          {/* AI 요약 */}
          {vc.aiSummary && vc.aiSummary.length > 0 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>핵심 요약</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {vc.aiSummary.map((item, i) => (
                    <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB', fontSize: '0.95rem', color: '#333' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 마무리 */}
          {vc.outro && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.outroTitle || '마무리'}</h2>
                <div dangerouslySetInnerHTML={{ __html: _rd(vc.outro) }} />
              </div>
            </section>
          )}

          {/* 키워드 밀도 보강 (커스텀 콘텐츠용 — 적응형) */}
          {vcBoosterTexts.length > 0 && (
            <section className="detail-section">
              <div className="container narrow">
                {vcBoosterTexts.map((text, i) => (
                  <p key={i} style={{ marginBottom: '1rem' }}>{text}</p>
                ))}
              </div>
            </section>
          )}

          {/* 키워드 밀도 희석 (긴 이름 업소용 — 2.5% 이하로) */}
          {densityDiluterTexts.length > 0 && (
            <section className="detail-section">
              <div className="container narrow">
                {densityDiluterTexts.map((text, i) => (
                  <p key={i} style={{ marginBottom: '1rem' }}>{text}</p>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          {/* 생성 콘텐츠 (venue-content 없는 업소) */}
          <section className="detail-section">
            <div className="container narrow">
              <h2>{year}년 방문 가이드</h2>
              {gc.narrative.split('\n\n').map((p, i) => (
                <p key={i} style={{ marginBottom: '1.25rem' }}>{_rd(p)}</p>
              ))}
            </div>
          </section>

          {/* 본문 이미지 1 */}
          <div className="container narrow" style={{ margin: '1.5rem auto' }}>
            <img src={bodyImages[0]} alt={venue.name} style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* 첫 방문 가이드 */}
          <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
            <div className="container narrow">
              <h2>처음 방문하세요?</h2>
              <p style={{ marginBottom: '1rem' }}>{_rd(gc.guide.intro)}</p>
              <ul className="checklist">
                <li>신분증 지참 (주민등록증·면허증·여권)</li>
                {gc.guide.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                <li>귀가 교통편 미리 확인</li>
              </ul>
            </div>
          </section>

          {/* 본문 이미지 2 */}
          <div className="container narrow" style={{ margin: '1.5rem auto' }}>
            <img src={bodyImages[1]} alt={venue.name} style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* 방문 체크리스트 */}
          <section className="detail-section">
            <div className="container narrow">
              <h2>방문 전 체크리스트</h2>
              <ul className="checklist">
                {gc.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </section>

          {/* 본문 이미지 3 */}
          <div className="container narrow" style={{ margin: '1.5rem auto' }}>
            <img src={bodyImages[2]} alt={venue.name} style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* 키워드 밀도 희석 (긴 이름 업소용 — 2.5% 이하로) */}
          {densityDiluterTexts.length > 0 && (
            <section className="detail-section">
              <div className="container narrow">
                {densityDiluterTexts.map((text, i) => (
                  <p key={i} style={{ marginBottom: '1rem' }}>{text}</p>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* 기본 정보 */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>{h2Count >= 1 ? venue.name + ' ' : ''}기본 정보</h2>
          <table className="info-table">
            <tbody>
              {venue.address && <tr><th>주소</th><td>{venue.address}</td></tr>}
              {venue.hours && <tr><th>영업시간</th><td>{venue.hours}</td></tr>}
              {venue.station && <tr><th>교통</th><td>{venue.station}</td></tr>}
              {hasPhone && <tr><th>담당</th><td>{venue.nickname}</td></tr>}
              {filteredTags.length > 0 && <tr><th>태그</th><td>{filteredTags.join(', ')}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>{h2Count >= 2 ? venue.name + ' ' : ''}자주 묻는 질문</h2>
          {faqItems.map((f, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q">Q. {f.q}</p>
              <p className="faq-a">{typeof f.a === 'string' ? f.a : ''}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 인기 시간대 */}
      <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
        <div className="container narrow">
          <h2>{h2Count >= 3 ? venue.name + ' ' : ''}인기 시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {gc.timeSlots.map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ minWidth: '80px', fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{t.time}</span>
                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: t.bar, background: '#4F46E5', height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#555', minWidth: '40px' }}>{t.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 찾아가는 길 (MiniMap) */}
      {(venue.address || venue.station) && (
        <section className="detail-section">
          <div className="container narrow">
            <MiniMap venue={venue} />
          </div>
        </section>
      )}

      {/* 태그 (카테고리 단어 제외 — 스터핑 방지) */}
      {filteredCardTags.length > 0 && (
        <section style={{ padding: '1rem 0' }}>
          <div className="container narrow">
            {filteredCardTags.map(t => (
              <span key={t} className="venue-card-tag" style={{ marginRight: '0.4rem', display: 'inline-block', marginBottom: '0.25rem' }}>{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* 비교표 — 이 곳 vs 비슷한 곳 */}
      {related.length > 0 && (
        <section className="detail-section">
          <div className="container narrow">
            <h2>이 곳 vs 비슷한 곳</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="info-table" style={{ minWidth: '320px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #4F46E5' }}>
                    <th style={{ width: '30%' }}>항목</th>
                    <th style={{ fontWeight: 700, color: '#4F46E5' }}>{venue.name}</th>
                    <th>{related[0].name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th>지역</th><td>{venue.region}</td><td>{related[0].region}</td></tr>
                  <tr><th>카테고리</th><td>{catLabel}</td><td>{CAT_SLUG_TO_LABEL[related[0].cat_slug] || related[0].category}</td></tr>
                  {venue.hours && <tr><th>영업시간</th><td>{venue.hours}</td><td>{related[0].hours || '문의'}</td></tr>}
                  {venue.station && <tr><th>교통</th><td>{venue.station}</td><td>{related[0].station || '문의'}</td></tr>}
                  <tr><th>분위기</th><td>{venue.card_hook}</td><td>{related[0].card_hook}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 첫 방문 vs 단골 */}
      <section className="detail-section">
        <div className="container narrow">
          <BeforeAfter catSlug={venue.cat_slug} />
        </div>
      </section>

      {/* 스와이프 갤러리 (6장 + 사진별 캡션) */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>사진 갤러리</h2>
          <SwipeGallery images={galleryImages} name={venue.name} catSlug={venue.cat_slug} />
        </div>
      </section>

      {/* 직접 가본 손님의 한마디 */}
      <section className="detail-section">
        <div className="container narrow">
          <ReviewHighlight name={venue.name} catSlug={venue.cat_slug} />
        </div>
      </section>

      {/* VS 투표 */}
      {related.length >= 2 && (
        <div className="container narrow">
          <VsVote a={venue} b={related[0]} />
        </div>
      )}

      {/* 오늘의 운세 */}
      <div className="container narrow">
        <DailyFortune catSlug={venue.cat_slug} />
      </div>

      {/* 이 업소의 비밀 (80% 스크롤 시 등장) */}
      <div className="container narrow">
        <SecretReveal name={venue.name} catSlug={venue.cat_slug} />
      </div>

      {/* 놀쿨에서 확인 CTA */}
      <div className="container narrow">
        <div style={{ background: '#EEF2FF', border: '2px solid #4F46E5', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', margin: '2rem 0' }}>
          <p style={{ fontSize: '1rem', color: '#111', marginBottom: '0.75rem', fontWeight: 600 }}>더 자세한 정보가 궁금하다면</p>
          <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#4F46E5', color: '#FFF', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
            놀쿨에서 확인 →
          </a>
        </div>
      </div>

      {/* 다음 글 추천 */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <h2>다음에 읽을 글</h2>
            <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>이 글을 읽은 사람이 많이 본 곳</p>
            <div className="venue-grid">
              {related.map(v => <VenueCard key={v.slug} venue={v} />)}
            </div>
          </div>
        </section>
      )}

      {/* 무한스크롤 추천 */}
      {sameCatVenues.length > 0 && (
        <section className="detail-section">
          <div className="container narrow">
            <InfiniteRecommend venues={sameCatVenues} />
          </div>
        </section>
      )}

      {/* 50% 스크롤 시 숨겨진 장점 스티키 카드 */}
      <StickyHighlight name={venue.name} catSlug={venue.cat_slug} />

      {/* StickyPhoneBar (광고주 있는 업소만) */}
      {hasPhone && <StickyPhoneBar name={venue.name} nickname={venue.nickname} phone={venue.nickname_phone} />}
    </>
  );
}
