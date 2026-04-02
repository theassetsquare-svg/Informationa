import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/venues';
import { SITE_NAME } from '../../lib/gold-content';
import CommunityBoard from '../../components/CommunityBoard';

export const metadata: Metadata = {
  title: '경험담 나누는 게시판 — 후기·동행모집·솔직 질문',
  description: '방문 후기, 동행 모집, 궁금한 거 질문까지. 직접 다녀온 사람들이 경험을 나누는 공간.',
  alternates: { canonical: SITE_URL + '/community/' },
  openGraph: {
    title: '경험담 나누는 게시판 — 후기·동행모집·솔직 질문',
    description: '방문 후기, 동행 모집, 궁금한 거 질문까지.',
    url: SITE_URL + '/community/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: SITE_URL + '/og/home.png', width: 1200, height: 1200 }],
  },
};

export default function CommunityPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span> 커뮤니티
        </div>
        <h1 style={{ marginTop: '1rem' }}>커뮤니티</h1>
        <p style={{ maxWidth: '600px', marginBottom: '2rem', color: 'var(--text-sub)' }}>
          밤문화 경험을 나누고, 동행을 구하고, 궁금한 걸 물어보는 공간이다.
        </p>
        <CommunityBoard />
      </div>
    </section>
  );
}
