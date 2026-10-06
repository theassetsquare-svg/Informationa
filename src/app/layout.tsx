import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import ScrollProgress from '../components/ScrollProgress';
import ErrorBoundary from '../components/ErrorBoundary';
import RetentionCore from '../components/RetentionCore';
import GlobalEngagementBoost from '../components/GlobalEngagementBoost';
import HideOnAdPath from '../components/HideOnAdPath';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://hh.nolcool.com'),
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  verification: {
    google: 'HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88',
    other: { 'naver-site-verification': ['1179edfcfa456f3ab7573e53979cfe0932a148d3', 'b9e9ebff09f3a18fa54ecf3ed2887fe05cdcfb16'] },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <ScrollProgress />
        <a href="#main" className="sr-only">본문으로 건너뛰기</a>
        <Header />
        <ErrorBoundary>
          <main id="main">{children}</main>
        </ErrorBoundary>
        <Footer />
        {/* 광고주 쪽에서는 체류 위젯(가짜 후기 인용 · 점수 · 뒤로가기 가로채기)을 띄우지 않는다 — 다른 쪽은 그대로 */}
        <HideOnAdPath>
          <RetentionCore />
          <GlobalEngagementBoost />
        </HideOnAdPath>
        <BottomNav />
      </body>
    </html>
  );
}
