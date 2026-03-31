import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import ScrollProgress from '../components/ScrollProgress';
import ErrorBoundary from '../components/ErrorBoundary';
import RetentionCore from '../components/RetentionCore';
import GlobalEngagementBoost from '../components/GlobalEngagementBoost';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://informationa.pages.dev'),
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  verification: {
    google: 'HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88',
    other: { 'naver-site-verification': '1179edfcfa456f3ab7573e53979cfe0932a148d3' },
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
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          media="print"
          // @ts-expect-error onLoad for async CSS
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          />
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <ScrollProgress />
        <a href="#main" className="sr-only">본문으로 건너뛰기</a>
        <Header />
        <ErrorBoundary>
          <main id="main">{children}</main>
        </ErrorBoundary>
        <Footer />
        <RetentionCore />
        <GlobalEngagementBoost />
        <BottomNav />
      </body>
    </html>
  );
}
