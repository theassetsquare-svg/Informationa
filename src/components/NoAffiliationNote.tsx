'use client';
import { usePathname } from 'next/navigation';
import { isAdPath } from '@/lib/ad-paths';

/* 푸터의 「제휴 관계가 없습니다」 한 줄 — 광고주 쪽(광고 고지가 있는 쪽)에서는 그리지 않는다(다른 쪽은 그대로).
   문장을 서버 컴포넌트에서 children 으로 넘기면 그 글자가 광고주 쪽 HTML 의 스크립트 자료(self.__next_f)와
   index.txt 에 그대로 실린다 → 문장을 이 클라이언트 컴포넌트 안에 둔다(글자는 JS 묶음에만 있다). */
export default function NoAffiliationNote() {
  const pathname = usePathname();
  if (isAdPath(pathname)) return null;
  return (
    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#444' }}>
      본 사이트는 정보 제공 목적이며 업소와 직접적인 제휴 관계가 없습니다.
    </p>
  );
}
