export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* 놀쿨 메인 사이트 유도 */}
      <div className="hooking-large">
        <h3>더 많은 정보가 궁금하다면</h3>
        <p>전국 나이트·클럽·라운지·룸·요정·호빠 실시간 정보</p>
        <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer">
          놀쿨에서 확인 →
        </a>
      </div>

      {/* 구글·AI 검색 유도 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
        padding: '1.25rem 1rem',
        textAlign: 'center',
      }}>
        <p style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
          구글 · AI에서<br />
          <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>&#39;놀쿨&#39;</span>을 검색하세요
        </p>
      </div>

      <footer className="footer">
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#4F46E5', marginBottom: '1rem', letterSpacing: '0.02em' }}>
            광고문의 카톡 besta12
          </p>

          {/* 6종 카테고리 */}
          <div className="footer-links">
            <a href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer">나이트</a>
            <a href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</a>
            <a href="/rooms/" target="_blank" rel="noopener noreferrer">룸</a>
            <a href="/yojeongs/" target="_blank" rel="noopener noreferrer">요정</a>
            <a href="/hoppas/" target="_blank" rel="noopener noreferrer">호빠</a>
          </div>

          {/* 지역 링크 (SEO 내부링크) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>강남</a>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>압구정</a>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>홍대</a>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>이태원</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>수유</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>수원</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>부산</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>대전</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>광주</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>울산</a>
            <a href="/rooms/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>일산</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>인천</a>
          </div>

          <p>&copy; {year} 놀쿨. 만 19세 이상 이용 가능.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#444' }}>
            본 사이트는 정보 제공 목적이며 업소와 직접적인 제휴 관계가 없습니다.
          </p>
        </div>
      </footer>
    </>
  );
}
