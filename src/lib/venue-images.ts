/**
 * 업소별 이미지 경로 유틸리티
 * OG 이미지 활용 + 갤러리별 색상 변형으로 다른 이미지 생성
 */

export function getVenueImage(catSlug: string, slug: string): string {
  return `/og/${catSlug}-${slug}.png`;
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
