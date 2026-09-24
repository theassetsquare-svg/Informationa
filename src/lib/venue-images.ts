/**
 * 업소별 이미지 경로 유틸리티
 * OG 이미지 활용 + 갤러리별 색상 변형으로 다른 이미지 생성
 */

export function getVenueImage(catSlug: string, slug: string): string {
  const k = `${catSlug}-${slug}`;
  /* 2026-09-24 광고주정리 — 옛 닉네임 든 카드를 새 카드(-v2)로 · 옛 파일은 둔다 */
  return `/og/${['night-busan-yeonsandong-mul-night', 'night-suwon-chancedom-night', 'night-busan-mul-night'].includes(k) ? k + '-v2' : k}.png`;
}

export function getVenueBodyImages(catSlug: string, slug: string, count = 4): string[] {
  // 본문 이미지: 각 위치별 다른 필터 파라미터로 구분
  return Array.from({ length: count }, (_, i) => `/og/body/${catSlug}-${slug}-${i + 1}.png`);
}

export function getVenueGalleryImages(catSlug: string, slug: string, count = 6): string[] {
  // 갤러리 이미지: 본문과 다른 세트
  return Array.from({ length: count }, (_, i) => `/og/gallery/${catSlug}-${slug}-g${i + 1}.png`);
}

export function hasVenueImage(): boolean {
  return true;
}
