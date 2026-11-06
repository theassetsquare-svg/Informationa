import { MetadataRoute } from 'next';
import { getAllVenues, SITE_URL } from '../lib/venues';
import { isNoindexPath } from '../lib/noindex';

export default function sitemap(): MetadataRoute.Sitemap {
  const venues = getAllVenues();
  const now = new Date().toISOString();

  const staticPages = [
    { url: SITE_URL + '/', lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: SITE_URL + '/clubs/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/nights/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/lounges/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/rooms/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/yojeongs/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/hoppas/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/quiz/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: SITE_URL + '/ranking/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: SITE_URL + '/vs/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: SITE_URL + '/roulette/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: SITE_URL + '/map/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: SITE_URL + '/gallery/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: SITE_URL + '/magazine/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: SITE_URL + '/dress-code/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: SITE_URL + '/safety/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: SITE_URL + '/community/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: SITE_URL + '/events/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: SITE_URL + '/chat/', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  /* 정리68-3(2026-11-07): noindex 쪽(dedicated/noindex-paths.json)은 사이트맵에서 뺌 — 주소·쪽은 그대로(200) */
  const venuePages = venues.filter(v => !isNoindexPath(`/${v.cat_slug}/${v.slug}/`)).map(v => ({
    url: `${SITE_URL}/${v.cat_slug}/${v.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...venuePages];
}
