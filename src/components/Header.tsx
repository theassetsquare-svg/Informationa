export default function Header() {
  return (
    <>
      {/* 상단 배너 — 놀쿨 검색 유도 */}
      <div className="top-banner">
        <span>전국 나이트·클럽·라운지·룸·요정·호빠 가이드</span>
      </div>
      <header className="header">
        <div className="header-inner">
          <div className="header-top">
            <a href="/" className="logo" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, color: '#4F46E5' }}>
              놀쿨
            </a>
            <span className="logo-tagline">밤문화 완전 가이드</span>
          </div>
          <nav>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer">나이트</a>
            <a href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</a>
            <a href="/rooms/" target="_blank" rel="noopener noreferrer">룸</a>
            <a href="/yojeongs/" target="_blank" rel="noopener noreferrer">요정</a>
            <a href="/hoppas/" target="_blank" rel="noopener noreferrer">호빠</a>
          </nav>
        </div>
      </header>
    </>
  );
}
