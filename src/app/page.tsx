import type { Metadata } from 'next';
import { getCategories, getAllVenues, SITE_NAME, SITE_URL } from '../lib/venues';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';
import FeaturePageEngagement from '../components/FeaturePageEngagement';

const cats = getCategories();
const allVenues = getAllVenues();

const premiumSlugs = ['ilsan-room', 'ilsan-myeongwolgwan-yojeong'];
const premiumVenues = premiumSlugs.map(s => allVenues.find(v => v.slug === s)).filter(Boolean) as typeof allVenues;

const PRIORITY_SLUGS = [
  'busan-yeonsandong-mul-night', 'seongnam-shampoo-night', 'suwon-chancedom-night',
  'sillim-grandprix-night', 'cheongdam-h2o-night', 'paju-yadang-skydome-night', 'ulsan-champion-night',
];
const priorityVenues = PRIORITY_SLUGS.map(s => allVenues.find(v => v.slug === s)).filter(Boolean) as typeof allVenues;

const seenCat = new Set<string>();
const top5 = allVenues.filter(v => {
  if (seenCat.has(v.cat_slug)) return false;
  seenCat.add(v.cat_slug);
  return true;
}).slice(0, 5);

export const metadata: Metadata = {
  title: '전국 나이트·클럽 114곳 총정리 — 이 글 하나면 끝난다',
  description: '현장 경험자가 전국 나이트, 클럽, 라운지, 룸, 요정, 호빠 114곳을 직접 돌며 정리한 현장 리포트. 지역별 맞춤 추천, 시간대별 가이드, 복장 규정까지 이 한 페이지에 전부 담았다.',
  alternates: { canonical: SITE_URL + '/' },
  openGraph: {
    title: '전국 나이트·클럽 114곳 총정리 — 이 글 하나면 끝난다',
    description: '현장 경험자가 전국 114곳을 직접 돌며 정리한 현장 리포트. 지역별 추천부터 복장 규정까지 전부 담았다.',
    url: SITE_URL + '/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: SITE_URL + '/og/home.png', width: 1200, height: 1200 }],
  },
};

export default function HomePage() {
  const year = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: SITE_NAME, url: SITE_URL,
    description: '현장 경험자가 전국 114곳 나이트·클럽·라운지·룸·요정·호빠를 직접 돌며 정리한 현장 리포트.',
    potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };

  const catDescs: Record<string, string> = {
    club: '비트 위에서 밤을 보내는 곳',
    night: '테이블과 격식의 전통 문화',
    lounge: '잔을 기울이며 나누는 대화',
    room: '문 닫으면 우리만의 공간',
    yojeong: '한정식과 국악의 풍류',
    hoppa: '여성을 위한 고급 선택',
  };

  const catIcons: Record<string, string> = {
    club: '#6D28D9', night: '#BE185D', lounge: '#0E7490',
    room: '#1D4ED8', yojeong: '#047857', hoppa: '#BE123C',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ═══ 히어로 + 검색 ═══ */}
      <section style={{ padding: '2.5rem 0 1.5rem', background: 'linear-gradient(180deg, #EEF2FF 0%, #F7F7F8 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#4F46E5', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            놀쿨 GUIDE
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', marginBottom: '0.5rem', color: '#111', lineHeight: 1.3 }}>
            전국 나이트·클럽·라운지<br />룸·요정·호빠 현장 리포트
          </h1>
          <p style={{ color: '#555', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            전국 {allVenues.length}곳 · {year}년 직접 확인한 현장 정보
          </p>
          <SearchBar venues={allVenues} />
        </div>
      </section>

      {/* ═══ 6종 카테고리 아이콘 그리드 ═══ */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {cats.map(cat => (
              <a key={cat.slug} href={cat.path} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.5rem',
                  background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px',
                  textDecoration: 'none', color: '#111', transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: catIcons[cat.slug] || '#4F46E5' }}>{cat.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>{cat.count}곳</span>
                <span style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>{catDescs[cat.slug]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PREMIUM — 신실장 직통 상담 ═══ */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '2px solid #F59E0B',
            borderRadius: '16px', padding: '1.25rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ background: '#F59E0B', color: '#111', fontSize: '0.7rem', fontWeight: 700,
                padding: '0.2rem 0.6rem', borderRadius: '4px' }}>PREMIUM</span>
              <span style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 600 }}>신실장 직통 상담</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {premiumVenues.map(v => (
                <div key={v.slug} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1rem',
                  border: '1px solid #FCD34D', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
                  <a href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#111', flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{v.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#555' }}>{v.card_hook}</p>
                  </a>
                  <a href="tel:010-3695-4929" target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', background: '#15803D', color: '#FFF', fontWeight: 700,
                      fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none',
                      marginTop: '0.75rem' }}>
                    신실장 010-3695-4929
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 지금 핫한 곳 TOP5 ═══ */}
      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container">
          <h2>지금 핫한 곳</h2>
          <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>카테고리별 대표 공간</p>
          <div className="venue-grid">
            {top5.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* ═══ 담당 직통 연결 ═══ */}
      <section className="section">
        <div className="container">
          <h2>담당 직통 연결</h2>
          <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>전화 한 통으로 바로 상담</p>
          <div className="venue-grid">
            {priorityVenues.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* ═══ 시간대별 추천 ═══ */}
      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container narrow">
          <h2>지금 이 시간, 어디가 좋을까</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { t: '19~22시 · 워밍업', d: '라운지에서 칵테일 한 잔. 요정에서 한정식 코스. 저녁부터 자연스럽게 밤으로 이어진다.' },
              { t: '22~01시 · 피크타임', d: '테이블석이 가장 뜨거운 시간. 플로어 입장 대기가 시작된다. 일찍 움직이는 게 유리하다.' },
              { t: '01~05시 · 심야', d: '진짜 밤은 자정 넘어서. 에너지가 정점에 달하는 하이라이트. 귀가 앱 미리 준비하자.' },
            ].map(item => (
              <div key={item.t} style={{ padding: '1.25rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#4F46E5' }}>{item.t}</h3>
                <p style={{ fontSize: '0.9rem', color: '#333' }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 전국 둘러보기 ═══ */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>전국 {allVenues.length}곳 둘러보기</h2>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            {cats.map(cat => (
              <a key={cat.slug} href={cat.path} target="_blank" rel="noopener noreferrer"
                style={{ padding: '0.6rem 1.25rem', background: '#4F46E5', color: '#FFFFFF',
                  borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                {cat.name} {cat.count}곳
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 지역별 밤의 표정 ═══ */}
      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container narrow">
          <h2>지역별 밤의 표정</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { name: '강남·서초', desc: '대형 플로어와 고급 라운지 밀집 지역. 트렌드의 중심이다.' },
              { name: '압구정·청담', desc: '세련된 분위기. 20~30대 직장인이 주 고객층을 이룬다.' },
              { name: '홍대·이태원', desc: '글로벌 감각의 인디 씬. 장르 폭이 가장 넓다.' },
              { name: '수유·노원·상봉', desc: '전통 사교 문화의 본거지. 오래된 단골이 많은 곳.' },
              { name: '수원·성남·인덕원', desc: '경기권 밤문화 격전지. 서울 접근성이 뛰어나다.' },
              { name: '부산·울산', desc: '연산동·해운대 중심. 서울과는 또 다른 온도를 느낄 수 있다.' },
              { name: '일산·파주', desc: '경기 북부 사교 문화의 거점. 룸과 요정이 강세.' },
            ].map(r => (
              <div key={r.name} style={{ padding: '1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#111' }}>{r.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#333' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section">
        <div className="container narrow">
          <h2>자주 묻는 질문</h2>
          {[
            { q: '처음인데 어디부터 가면 좋을까?', a: '테이블 문화가 궁금하면 수유·노원 쪽 나이트. 대형 플로어를 원하면 강남 클럽. 조용한 곳이면 압구정 라운지가 좋다.' },
            { q: '혼자 가도 괜찮은가?', a: '바 카운터가 있는 라운지라면 어색하지 않다. 1인 방문 손님은 생각보다 많다.' },
            { q: '복장 규정이 있나?', a: '깔끔한 캐주얼이 기본. 강남·청담권은 슬리퍼·트레이닝복 입장을 제한하는 곳이 많다.' },
            { q: '궁금한 게 더 있으면?', a: '각 업소 상세 페이지에서 전화번호를 확인할 수 있다. 전화 문의가 가장 정확하다.' },
            { q: '새벽에 귀가는 어떻게?', a: '카카오T 미리 설치. 지하철 막차는 자정 전후니 시간을 체크하자.' },
          ].map((f, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q">Q. {f.q}</p>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 매거진 미리보기 ═══ */}
      <section style={{ padding: '1.5rem 0', background: '#F7F7F8' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem' }}>읽을거리</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { title: '처음 가는 사람을 위한 완벽 안내서', cat: '나이트', id: 'beginner-night-guide' },
              { title: '클럽 vs 나이트, 뭐가 다른 거야?', cat: '클럽·나이트', id: 'club-vs-night' },
              { title: '1인 방문해도 괜찮을까? 솔로 방문 솔직 후기', cat: '전체', id: 'solo-visit-review' },
            ].map(m => (
              <a key={m.id} href="/magazine/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', padding: '1rem 1.25rem', background: '#FFFFFF',
                  border: '1px solid #E5E7EB', borderRadius: '12px', textDecoration: 'none',
                  transition: 'box-shadow 0.2s' }}>
                <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600 }}>{m.cat}</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 600, color: '#111' }}>{m.title}</p>
              </a>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <a href="/magazine/" target="_blank" rel="noopener noreferrer"
              style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
              매거진 전체 보기
            </a>
          </p>
        </div>
      </section>

      {/* ═══ 최종 CTA ═══ */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '1px solid rgba(79,70,229,0.2)',
            borderRadius: '16px', padding: '2rem 1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: '0.5rem', color: '#111' }}>
              더 자세한 정보가 필요하다면
            </h2>
            <p style={{ color: '#555', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              전국 {allVenues.length}곳의 상세 정보, 실시간 현장 소식까지
            </p>
            <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#4F46E5', color: '#FFFFFF',
                padding: '0.85rem 2.5rem', borderRadius: '10px', fontWeight: 700,
                textDecoration: 'none', fontSize: '1rem' }}>
              놀쿨에서 확인 &rarr;
            </a>
          </div>
        </div>
      </section>

      <FeaturePageEngagement venues={allVenues} />
    </>
  );
}
