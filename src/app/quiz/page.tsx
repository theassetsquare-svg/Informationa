import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, getAllVenues } from '../../lib/venues';
import QuizClient from '../../components/QuizClient';
import FeaturePageEngagement from '../../components/FeaturePageEngagement';

export const metadata: Metadata = {
  title: '나에게 맞는 유형 찾기 — 성향 테스트 10문항',
  description: '10개 객관식 질문에 답하면 6가지 유형 중 나에게 맞는 밤 문화 스타일을 진단. 결과에 맞는 장소도 추천한다.',
  alternates: { canonical: SITE_URL + '/quiz/' },
  openGraph: {
    title: '나에게 맞는 유형 찾기 — 성향 테스트 10문항',
    description: '10개 질문으로 나에게 맞는 밤 문화 유형을 진단한다.',
    url: SITE_URL + '/quiz/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: SITE_URL + '/og/home.png', width: 1200, height: 1200 }],
  },
};

export default function QuizPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 밤문화 성향 테스트
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container narrow" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>밤문화 성향 테스트</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem' }}>
            10개 질문에 답하면 나에게 맞는 밤문화 유형을 알려준다.
          </p>
          <QuizClient />
        </div>
      </section>

      <FeaturePageEngagement venues={getAllVenues()} />
    </>
  );
}
