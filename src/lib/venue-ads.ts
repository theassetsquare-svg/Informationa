/**
 * 광고주 세트(쪽 한정) — 서버 컴포넌트(가게 쪽 틀)만 읽는다.
 * ★ 'use client' 파일에서 불러오지 않는다: venues.json 은 클라이언트 묶음(지도·퀴즈·랭킹)과
 *   404 대체 화면 자료로 모든 쪽에 실리므로, 광고주 번호를 거기에 두면 다른 쪽 스크립트에 번진다.
 *   그래서 광고 칸은 이 파일(venue-ads.json)에 따로 둔다.
 * 광고문의 쪽(inquiry: true · 일산74-2 2026-11-12) — 광고주가 없는 쪽. 같은 깔끔한 틀(카드 = og = 본문 첫 그림 = JSON-LD)을 쓰되
 *   닉네임·번호·전화 링크·「광고」 딱지·광고 고지·고정 전화바는 싣지 않고 그 자리에 「광고문의 카카오톡 besta12」.
 */
import adsData from '../data/venue-ads.json';

export interface VenueAd {
  /** 광고문의 쪽(광고주 없음) — nickname·phone 은 빈 글자 */
  inquiry?: boolean;
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
  /** 일산76-2(2026-11-13) — 있으면 그 쪽만 이 값을 쓴다: 카드 그림 설명(번호 0) · 고정 전화바 보이는 글자(번호만) · 본문 끝 관계 고지 */
  alt?: string;
  bar_label?: string;
  notice?: string;
  /** 일산76-2 둘째 손질(2026-11-13) — 확인된 것만 싣는 쪽: 가게와 무관한 본문 그림·갤러리, 틀이 지어낸 비밀·장점 칸,
   *  키워드 밀도 보강 글, 비교표 분위기 줄, 첫 방문 vs 단골 칸의 확인 안 된 줄을 이 쪽에서만 싣지 않는다(다른 쪽은 그대로).
   *  체류 위젯은 ad-paths.ts 경로로 막는다. */
  strict?: boolean;
  /** 있으면 그 쪽 meta·og·twitter description 을 이 값으로(접객 낱말만 바꾼 글) */
  description?: string;
}

const ads = adsData as Record<string, VenueAd>;

export function getVenueAd(slug: string): VenueAd | null {
  return ads[slug] || null;
}

/** og:image:alt · 본문 카드 img alt */
export function adAlt(name: string, ad: VenueAd): string {
  if (ad.alt) return ad.alt;
  if (ad.inquiry) return `${name} 광고문의 카톡 besta12`;
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
