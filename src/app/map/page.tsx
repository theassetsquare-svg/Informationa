import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/venues';
import MapClient from '@/components/MapClient';

export const metadata: Metadata = {
  title: '내 근처 스팟 지도 — 반경 설정으로 바로 검색',
  description: '현재 위치 기준 반경을 설정하면 근처 업소가 핀으로 표시된다. 업종 필터와 거리순 정렬 지원.',
  alternates: { canonical: SITE_URL + '/map/' },
  openGraph: {
    title: '내 근처 스팟 지도 — 반경 설정으로 바로 검색',
    description: '현재 위치 기준 반경 설정으로 근처 업소를 검색한다.',
    url: SITE_URL + '/map/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: SITE_URL + '/og/home.png', width: 1200, height: 1200 }],
  },
};

export default function MapPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 지도
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem' }}>전국 밤문화 지도</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', maxWidth: '600px' }}>
            지역과 카테고리를 선택해 내 주변 업소를 찾아보자. 전국 110곳의 현장 정보를 바로 확인할 수 있다.
          </p>
          <MapClient />
        </div>
      </section>
    </>
  );
}
