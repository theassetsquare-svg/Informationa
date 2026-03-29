import VenueCard from './VenueCard';

interface CatPageProps {
  heading: string;
  intro: string;
  body: string;
  guide: { title: string; items: string[] };
  timeslots: { time: string; level: string; bar: string }[];
  venues: any[];
  catLabel: string;
  year: number;
  isHoppa?: boolean;
}

export default function CategoryPage({ heading, intro, body, guide, timeslots, venues, catLabel, year, isHoppa }: CatPageProps) {
  const accent = isHoppa ? '#F43F5E' : '#8B5CF6';
  const bgAccent = isHoppa ? '#FFF1F2' : '#FFFFFF';
  const borderAccent = isHoppa ? '#FDA4AF' : '#8B5CF6';
  const textAccent = isHoppa ? '#E11D48' : '#8B5CF6';

  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span> {catLabel}
        </div>

        {/* ① 소개글 500자+ */}
        <h1 style={{ marginTop: '1rem' }}>{heading}</h1>
        <p style={{ maxWidth: '480px', marginBottom: '1.5rem', color: '#333333' }}>{intro}</p>
        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: '#111111' }}>{body}</p>
          <p style={{ marginTop: '1rem', color: '#111111' }}>
            {year}년 기준 {venues.length}곳을 정리했다.
          </p>
        </div>

        {/* ② 업소 리스트 */}
        <div className="venue-grid">
          {venues.map(v => <VenueCard key={v.slug} venue={v} />)}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#444444', textAlign: 'center' }}>
          전체 {venues.length}곳 — 각 카드를 눌러 상세 확인
        </p>

        {/* ③ [D] 첫 방문 가이드 */}
        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem',
          background: bgAccent, borderRadius: '16px', border: `1px solid ${borderAccent}` }}>
          <h2 style={{ color: textAccent }}>{guide.title}</h2>
          <ul className="checklist">
            {guide.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ④ [E] 인기 시간대 */}
        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>인기 요일·시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {timeslots.map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ minWidth: '110px', fontSize: '0.9rem', fontWeight: 600 }}>{t.time}</span>
                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: t.bar, background: accent, height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#444444', minWidth: '40px' }}>{t.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ⑤ 놀쿨 CTA */}
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '2px solid rgba(79,70,229,0.3)', borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'center' }}>
            <h3 style={{ color: '#4F46E5', fontSize: '1.2rem', marginBottom: '0.5rem' }}>더 자세한 정보가 궁금하다면</h3>
            <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>전국 {venues.length}곳의 상세 정보, 실시간 현장 소식까지</p>
            <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#4F46E5', color: '#FFF', padding: '0.85rem 2.5rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
              놀쿨에서 확인 →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
