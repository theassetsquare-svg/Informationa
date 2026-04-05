'use client';
import { useState, useEffect } from 'react';

/* ── 50% 스크롤 시 "이 업소의 숨겨진 장점" 스티키 카드 ── */
export default function StickyHighlight({ name, catSlug }: { name: string; catSlug: string }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 200) {
        const pct = window.scrollY / h;
        if (pct >= 0.5 && !show) setShow(true);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [show, dismissed]);

  if (!show || dismissed) return null;

  const highlights: Record<string, string[]> = {
    club: [
      '사운드 시스템이 클럽 전체를 감싸는 구조라 어디 서도 음질이 균일하다',
      '플로어 조명 세팅이 시간대별로 바뀌어서 새벽 감성이 특히 좋다',
      '바 카운터 동선이 넓어서 음료 주문에 대기가 거의 없다',
    ],
    night: [
      '무대와 테이블 거리가 적절해서 공연을 가까이에서 즐길 수 있다',
      '웨이터 응대 속도가 빨라서 테이블 서비스 만족도가 높다',
      '밴드 라이브 음향이 홀 전체에 고르게 퍼지도록 설계되어 있다',
    ],
    lounge: [
      '바텐더가 취향에 맞춰 만드는 비공개 메뉴가 있다',
      '인테리어 조명이 테이블별로 독립 조절되어 프라이빗 분위기가 좋다',
      '카운터석에서 바텐더와 대화하며 마시면 경험이 완전히 달라진다',
    ],
    room: [
      '방음이 철저해서 옆방 소리가 전혀 안 들린다',
      '기념일 세팅을 미리 요청하면 디테일이 다르다',
      '음향 시스템이 방 크기에 맞게 튜닝되어 있어서 몰입감이 좋다',
    ],
    yojeong: [
      '코스 요리의 식재료가 매일 아침 직접 들어온다',
      '좌석 배치가 격식 있는 대접에 최적화되어 있다',
      '국악 공연 시간을 미리 알면 코스와 타이밍을 맞출 수 있다',
    ],
    hoppa: [
      '매니저가 첫 방문자에게 분위기를 자연스럽게 이끌어준다',
      '호스트 교체를 부담 없이 요청할 수 있는 시스템이다',
      '평일 저녁에 가면 더 편안하고 여유로운 시간을 보낼 수 있다',
    ],
  };

  const pool = highlights[catSlug] || highlights.club;
  let h = 5381;
  for (let i = 0; i < name.length; i++) h = ((h << 5) + h + name.charCodeAt(i)) | 0;
  const highlight = pool[Math.abs(h) % pool.length];

  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 170, maxWidth: '420px', width: '90%',
      background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
      borderRadius: '16px', padding: '1rem 1.25rem',
      boxShadow: '0 12px 40px rgba(30,27,75,0.4)',
      animation: 'stickySlideUp 0.5s ease-out',
      color: '#FFF',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FCD34D', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            이 업소의 숨겨진 장점
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.6, color: '#E0E7FF' }}>
            {highlight}
          </p>
        </div>
        <button onClick={() => setDismissed(true)} style={{
          background: 'none', border: 'none', color: '#A5B4FC', fontSize: '1.2rem',
          cursor: 'pointer', padding: '0', lineHeight: 1, flexShrink: 0,
        }}>×</button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes stickySlideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}' }} />
    </div>
  );
}
