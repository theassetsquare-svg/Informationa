import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, getAllVenues } from '../../lib/venues';
import VsPageClient from '../../components/VsPageClient';
import FeaturePageEngagement from '../../components/FeaturePageEngagement';

export const metadata: Metadata = {
  title: '업소 대결 투표 — 두 곳 중 어디가 더 나을까',
  description: '매주 새 대진표로 두 업소를 나란히 비교. 투표하고 다른 사람들의 선택 통계를 확인한다.',
  alternates: { canonical: SITE_URL + '/vs/' },
  openGraph: {
    title: '업소 대결 투표 — 두 곳 중 어디가 더 나을까',
    description: '매주 새 대진표로 두 업소를 나란히 비교 투표.',
    url: SITE_URL + '/vs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: SITE_URL + '/og/home.png', width: 1200, height: 1200 }],
  },
};

export default function VsPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> VS 대결
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container narrow">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>업소 대결</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-sub)', marginBottom: '2.5rem' }}>
            어디가 더 나을까? 투표하고 다른 사람들의 선택을 확인하자.
          </p>

          <h2 style={{ marginBottom: '1.5rem' }}>이번주 대결</h2>
          <VsPageClient />
        </div>
      </section>

      <FeaturePageEngagement venues={getAllVenues()} />
    </>
  );
}
