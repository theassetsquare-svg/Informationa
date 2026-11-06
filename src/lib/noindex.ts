/**
 * noindex 쪽 목록 — 정리68-3(2026-11-07 · 상위노출 정리).
 * 가게 전용 사이트(수원찬스돔나이트 · 수원)와 지역이 다른 다른 가게 쪽은 주소·글은 그대로 두고
 * <meta name="robots" content="noindex, follow"> 를 넣고 사이트맵에서 뺀다(301 0 · 지우기 0).
 * 목록의 유일 출처 = dedicated/noindex-paths.json (public 머리 설정 파일의 X-Robots-Tag 줄도 같은 목록).
 */
import noindexData from '../../dedicated/noindex-paths.json';

const NOINDEX_PATHS: ReadonlySet<string> = new Set(
  (noindexData as { paths: { path: string }[] }).paths.map(p => p.path),
);

export function isNoindexPath(pathname: string): boolean {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  return NOINDEX_PATHS.has(p);
}

export function noindexCount(): number {
  return NOINDEX_PATHS.size;
}
