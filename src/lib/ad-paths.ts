/**
 * 광고주 쪽 경로 목록 — 클라이언트 컴포넌트가 읽어도 되는 값(경로만 · 닉네임·번호 없음).
 * src/data/venue-ads.json 에 가게를 더하면 여기에도 그 쪽 경로를 더한다.
 */
export const AD_PATHS: string[] = ['/night/sillim-grandprix-night/'];

export function isAdPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  return AD_PATHS.includes(p);
}
