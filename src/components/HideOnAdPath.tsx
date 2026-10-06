'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { isAdPath } from '@/lib/ad-paths';

/* 광고주 쪽에서는 그리지 않는다(다른 쪽은 그대로) — 「제휴 관계가 없습니다」 문장 · 가짜 후기 인용이 뜨는 체류 위젯 */
export default function HideOnAdPath({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isAdPath(pathname)) return null;
  return <>{children}</>;
}
