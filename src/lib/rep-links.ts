// 정리68-3(2026-11-07) — 보호 쪽의 대표 쪽 링크 1개 (dedicated/rep-links.json 한 곳)
import repData from '../../dedicated/rep-links.json';
// 네이버70-1(2026-11-08) — 겹침 쪽 큰제목 바로 뒤 대표 쪽 링크 한 줄 (dedicated/naver70-top-links.json 한 곳)
import topData from '../../dedicated/naver70-top-links.json';

export interface RepLink { url: string; before: string; text: string; after: string }

const DATA = repData as { links: Record<string, { before: string; text: string; after: string }>; urls: Record<string, string> };

export function getRepLink(slug: string): RepLink | null {
  const l = DATA.links[slug];
  const url = DATA.urls[slug];
  if (!l || !url) return null;
  return { url, before: l.before || '', text: l.text, after: l.after || '' };
}

const TOP = (topData as { links: Record<string, { url: string; before?: string; text: string; after?: string }> }).links;

export function getTopRepLink(slug: string): RepLink | null {
  const l = TOP[slug];
  if (!l || !l.url || !l.text) return null;
  return { url: l.url, before: l.before || '', text: l.text, after: l.after || '' };
}

export function repLinkCount(): number {
  return Object.keys(DATA.links).filter(s => DATA.urls[s]).length;
}
