import type { Metadata } from 'next';
import { getAllVenues, getVenueBySlug, getRelatedVenues, SITE_URL, CAT_SLUG_TO_LABEL } from '../../../lib/venues';
import { generateGoldContent, SITE_NAME } from '../../../lib/gold-content';
import { loadVenueContent, stripHtml } from '../../../lib/venue-loader';
import VenueCard from '../../../components/VenueCard';
import StickyPhoneBar from '../../../components/StickyPhoneBar';
import { ReadingProgress, AutoNext, EndlessRecommend, FOMOCounter, BlurReveal } from '../../../components/AddictionEngine';
import { MidContentHook, SimilarVenuesHook, AIRecommendHook, FullCompareHook } from '../../../components/HookingCTAs';
import RecentTracker from '../../../components/RecentTracker';

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
      images: [{ url: gc.ogImage, width: 1200, height: 630 }],
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

  // JSON-LD
  const localBizLd = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
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

      {/* 방문 기록 저장 (개인화 추천용) */}
      <RecentTracker slug={venue.slug} />

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
            <p style={{ color: '#6D28D9', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              담당: {venue.nickname}
            </p>
          )}
          <div className="detail-meta">
            <span>{venue.region}</span>
            {venue.hours && <span>{venue.hours}</span>}
          </div>
          <div style={{ marginTop: '0.75rem' }}><FOMOCounter /></div>
        </div>
      </section>

      {/* ═══ 본문 — venue-content 있으면 고유 콘텐츠, 없으면 생성 콘텐츠 ═══ */}
      {vc ? (
        <>
          {/* 인트로 */}
          <section className="detail-section">
            <div className="container narrow">
              <h2>{vc.prologueTitle || `${year}년 방문 가이드`}</h2>
              <div dangerouslySetInnerHTML={{ __html: vc.prologue }} />
            </div>
          </section>

          {/* [후킹2] 중간 끊기 */}
          <div className="container"><MidContentHook /></div>

          {/* 장면 1 */}
          {vc.scene1 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.scene1Title || '현장 스케치'}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.scene1 }} />
              </div>
            </section>
          )}

          {/* [후킹4] AI 추천 */}
          <div className="container"><AIRecommendHook /></div>

          {/* 장면 2 */}
          {vc.scene2 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.scene2Title || '더 알아야 할 것'}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.scene2 }} />
              </div>
            </section>
          )}

          {/* 실전 팁 */}
          {vc.tipSection && (
            <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
              <div className="container narrow">
                <h2>{vc.tipTitle || '실전 팁'}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.tipSection }} />
              </div>
            </section>
          )}

          {/* 대화 */}
          {vc.dialogueSection && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.dialogueTitle || '이런 대화가 오간다'}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.dialogueSection }} />
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
                <div dangerouslySetInnerHTML={{ __html: vc.outro }} />
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
                <p key={i} style={{ marginBottom: '1.25rem' }}>{p}</p>
              ))}
            </div>
          </section>

          {/* [후킹2] 중간 끊기 */}
          <div className="container"><MidContentHook /></div>

          {/* 첫 방문 가이드 */}
          <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
            <div className="container narrow">
              <h2>처음 방문하세요?</h2>
              <p style={{ marginBottom: '1rem' }}>{gc.guide.intro}</p>
              <ul className="checklist">
                <li>신분증 지참 (주민등록증·면허증·여권)</li>
                {gc.guide.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                <li>귀가 교통편 미리 확인</li>
              </ul>
            </div>
          </section>

          {/* [후킹4] AI 추천 */}
          <div className="container"><AIRecommendHook /></div>

          {/* 방문 체크리스트 */}
          <section className="detail-section">
            <div className="container narrow">
              <h2>방문 전 체크리스트</h2>
              <ul className="checklist">
                {gc.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </section>
        </>
      )}

      {/* 기본 정보 */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>기본 정보</h2>
          <table className="info-table">
            <tbody>
              {venue.address && <tr><th>주소</th><td>{venue.address}</td></tr>}
              {venue.hours && <tr><th>영업시간</th><td>{venue.hours}</td></tr>}
              {venue.station && <tr><th>교통</th><td>{venue.station}</td></tr>}
              {hasPhone && <tr><th>담당</th><td>{venue.nickname} ({venue.nickname_phone})</td></tr>}
              {filteredTags.length > 0 && <tr><th>태그</th><td>{filteredTags.join(', ')}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ — BlurReveal로 클릭 유도 */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>Q&amp;A</h2>
          <BlurReveal label="전체 Q&A 보기">
            {faqItems.map((f, i) => (
              <div key={i} className="faq-item">
                <p className="faq-q">Q. {f.q}</p>
                <p className="faq-a">{typeof f.a === 'string' ? f.a : ''}</p>
              </div>
            ))}
          </BlurReveal>
        </div>
      </section>

      {/* 인기 시간대 */}
      <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
        <div className="container narrow">
          <h2>인기 시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {gc.timeSlots.map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ minWidth: '80px', fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{t.time}</span>
                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: t.bar, background: '#8B5CF6', height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#555', minWidth: '40px' }}>{t.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 위치 안내 */}
      {(venue.address || venue.station) && (
        <section className="detail-section">
          <div className="container narrow">
            <h2>찾아가는 길</h2>
            {venue.address && <p>{venue.address}</p>}
            {venue.station && <p style={{ marginTop: '0.5rem' }}>{venue.station}</p>}
            {venue.map_url && (
              <p style={{ marginTop: '0.5rem' }}>
                <a href={venue.map_url} target="_blank" rel="noopener noreferrer">지도에서 보기 →</a>
              </p>
            )}
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

      {/* [후킹3] 비슷한 곳 → 메인 */}
      <div className="container"><SimilarVenuesHook /></div>

      {/* 관련 업소 */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <h2>비슷한 곳</h2>
            <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>같은 카테고리에서 추천</p>
            <div className="venue-grid">
              {related.map(v => <VenueCard key={v.slug} venue={v} />)}
            </div>
          </div>
        </section>
      )}

      {/* 읽기 진행률 */}
      <ReadingProgress />

      {/* [후킹5] 전체 비교 */}
      <div className="container"><FullCompareHook /></div>

      {/* 자동 다음 추천 */}
      <section className="section">
        <div className="container narrow">
          <AutoNext venues={related} current={venue.slug} />
        </div>
      </section>

      {/* 끝없는 추천 */}
      <section className="section">
        <div className="container narrow">
          <EndlessRecommend venues={related} />
        </div>
      </section>

      {/* SocialProofToast, JourneyTimer, SlideUpHook, ScrollBannerHook → layout.tsx에서 전역 활성화 */}

      {/* 하단 여백 */}
      <div style={{ paddingBottom: hasPhone ? '80px' : '0' }} />

      {/* StickyPhoneBar */}
      {hasPhone && <StickyPhoneBar name={venue.name} nickname={venue.nickname} phone={venue.nickname_phone} />}
    </>
  );
}
