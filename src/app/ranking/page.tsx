import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, getAllVenues } from '@/lib/venues';
import RankingClient from '@/components/RankingClient';
import FeaturePageEngagement from '@/components/FeaturePageEngagement';

export const metadata: Metadata = {
  title: '이번 주 인기 순위 TOP 20 — 조회수 실시간 집계',
  description: '지금 가장 주목받는 밤 문화 업소 TOP 20. 카테고리별·기간별 필터로 순위 변동을 확인한다.',
  alternates: { canonical: SITE_URL + '/ranking/' },
  openGraph: {
    title: '이번 주 인기 순위 TOP 20 — 조회수 실시간 집계',
    description: '지금 가장 주목받는 밤 문화 업소 TOP 20.',
    url: SITE_URL + '/ranking/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: SITE_URL + '/og/home.png', width: 1200, height: 1200 }],
  },
};

export default function RankingPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 인기 랭킹
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem' }}>인기 랭킹 TOP 20</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', maxWidth: '600px' }}>
            지금 가장 주목받는 전국 밤문화 업소를 확인하자. 카테고리와 기간별로 필터링할 수 있다.
          </p>
          <RankingClient />
        </div>
      </section>

      <FeaturePageEngagement venues={getAllVenues()} />
    </>
  );
}
