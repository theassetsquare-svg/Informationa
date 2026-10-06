/**
 * 광고주 세트(쪽 한정) — 서버 컴포넌트(가게 쪽 틀)만 읽는다.
 * ★ 'use client' 파일에서 불러오지 않는다: venues.json 은 클라이언트 묶음(지도·퀴즈·랭킹)과
 *   404 대체 화면 자료로 모든 쪽에 실리므로, 광고주 번호를 거기에 두면 다른 쪽 스크립트에 번진다.
 *   그래서 광고 칸은 이 파일(venue-ads.json)에 따로 둔다.
 */
import adsData from '../data/venue-ads.json';

export interface VenueAd {
  nickname: string;
  phone: string;
  /** 4줄 카드(1200×1200) — 그 쪽 자신의 og · 본문 첫 그림 · JSON-LD 에만 쓴다 */
  card: string;
  address: string;
  address_region: string;
  address_locality: string;
  address_street: string;
  /** 확인일 (YYYY-MM-DD) */
  confirmed: string;
  /** 이 쪽 추천 카드에서 축소판을 걷을 가게 slug (옛 카드에 다른 담당 닉네임이 그려진 것) */
  hide_thumbs?: string[];
}

const ads = adsData as Record<string, VenueAd>;

export function getVenueAd(slug: string): VenueAd | null {
  return ads[slug] || null;
}

/** og:image:alt · 본문 카드 img alt */
export function adAlt(name: string, ad: VenueAd): string {
  return `${name} ${ad.nickname} ${ad.phone} 광고문의 카톡 besta12`;
}

/** tel: 링크용 숫자만 */
export function adTel(ad: VenueAd): string {
  return ad.phone.replace(/\D/g, '');
}

/** JSON-LD telephone (+82-10-…) */
export function adTelIntl(ad: VenueAd): string {
  return '+82-' + ad.phone.replace(/^0/, '');
}
