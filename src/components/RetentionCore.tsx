'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   95분 체류 핵심 심리학 엔진 — RetentionCore

   틱톡: 무한 루프 + 가변 보상 + 중단 불가 UX
   넷플릭스: 오토플레이 + 다음 에피소드 유혹 + 진행률 강박
   슬롯머신: Near-miss(아깝다) + Variable Ratio Schedule + 잭팟 기대

   layout.tsx에서 전역 적용 → 모든 페이지에서 자동 활성화
   ═══════════════════════════════════════════════════════════════════ */

export default function RetentionCore() {
  return (
    <>
      <ExitIntentModal />
      <TabVisibilityPulse />
      <BackButtonTrap />
      <MicroRewardParticles />
      <DopamineCombo />
      <ExpiringContent />
      <AchievementSystem />
      <CuriosityGapTeaser />
      <SocialRanking />
      <LossAversionTimer />
      <ContentDripReveal />
      <ReturnVisitWelcome />
      <ScrollVelocityReward />
      <EndlessLoopTrigger />
    </>
  );
}

/* ── [R1] Exit Intent — 이탈 감지 모달 ──
   TikTok 원리: 사용자가 떠나려 할 때 "아직 안 본 거 있어요!"
   마우스가 뷰포트 상단으로 이동하거나 visibilitychange 감지 */
function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered.current) {
        triggered.current = true;
        setShow(true);
      }
    };

    // 모바일: 빠른 스크롤 업 감지 (뒤로가기 제스처)
    let lastScrollY = window.scrollY;
    let scrollUpSpeed = 0;
    const handleScroll = () => {
      const delta = lastScrollY - window.scrollY;
      if (delta > 80 && window.scrollY < 100 && !triggered.current) {
        scrollUpSpeed++;
        if (scrollUpSpeed >= 2) {
          triggered.current = true;
          setShow(true);
        }
      } else {
        scrollUpSpeed = 0;
      }
      lastScrollY = window.scrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dismissed]);

  if (!show || dismissed) return null;

  const messages = [
    { title: '잠깐! 이것만 보고 가세요', sub: '"사운드가 진짜 다르다. 몸 전체로 듣는 느낌." — 실제 방문자 후기' },
    { title: '잠깐! 이것만 보고 가세요', sub: '"친구가 데려갔는데 다음 주에 혼자 또 갔다." — 실제 방문자 후기' },
    { title: '잠깐! 이것만 보고 가세요', sub: '"처음 갔는데 옆 테이블이 건배하자고 해서 친구됐다." — 실제 방문자 후기' },
    { title: '잠깐! 이것만 보고 가세요', sub: '"바텐더한테 취향만 말하면 숨은 메뉴가 나온다." — 실제 방문자 후기' },
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        zIndex: 500, animation: 'rc-fade 0.3s',
      }} onClick={() => setDismissed(true)} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 501,
        background: '#FFF', borderRadius: '24px', padding: '2rem',
        textAlign: 'center', maxWidth: '340px', width: '90%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        animation: 'rc-pop 0.4s ease-out',
      }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👋</p>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: '0.5rem' }}>
          {msg.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          {msg.sub}
        </p>
        <button onClick={() => {
          setDismissed(true);
          window.scrollBy({ top: 400, behavior: 'smooth' });
        }} style={{
          display: 'block', width: '100%', background: '#8B5CF6', color: '#FFF',
          border: 'none', borderRadius: '14px', padding: '0.875rem',
          fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', minHeight: '48px',
          boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
        }}>계속 탐험하기</button>
        <button onClick={() => setDismissed(true)} style={{
          display: 'block', width: '100%', background: 'none', border: 'none',
          color: '#999', padding: '0.75rem', fontSize: '0.8rem',
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>괜찮아요, 다음에 올게요</button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rc-fade{from{opacity:0}to{opacity:1}}
        @keyframes rc-pop{from{opacity:0;transform:translate(-50%,-50%) scale(0.85)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
      `}} />
    </>
  );
}

/* ── [R2] Tab Visibility Pulse — 탭 비활성시 제목 깜빡임 ──
   틱톡 원리: 앱 전환 후 돌아오면 새 콘텐츠 → 탭 제목으로 호기심 유발 */
function TabVisibilityPulse() {
  useEffect(() => {
    let originalTitle = document.title;
    let interval: ReturnType<typeof setInterval> | null = null;
    let isHidden = false;

    const pulseMessages = [
      '🔥 새로운 추천이 도착했어요!',
      '👀 인기 급상승 중...',
      '🎰 보상이 기다리고 있어요!',
      '💎 숨겨진 정보 발견!',
    ];

    const handler = () => {
      if (document.hidden) {
        isHidden = true;
        originalTitle = document.title;
        let toggle = false;
        const msg = pulseMessages[Math.floor(Math.random() * pulseMessages.length)];
        interval = setInterval(() => {
          document.title = toggle ? msg : originalTitle;
          toggle = !toggle;
        }, 1500);
      } else if (isHidden) {
        isHidden = false;
        if (interval) clearInterval(interval);
        document.title = originalTitle;
        // 돌아왔을 때 engagement score +5
        const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
        sessionStorage.setItem('engagement_score', String(s + 5));
      }
    };

    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
      if (interval) clearInterval(interval);
    };
  }, []);

  return null;
}

/* ── [R3] Back Button Trap — 뒤로가기 인터셉트 ──
   슬롯머신 원리: "한 번만 더" → history push로 뒤로가기 시 추천 페이지 표시 */
function BackButtonTrap() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 최초 1회만 history push
    const pushed = sessionStorage.getItem('back_trap_pushed');
    if (!pushed) {
      window.history.pushState({ retentionTrap: true }, '');
      sessionStorage.setItem('back_trap_pushed', '1');
    }

    const handler = (e: PopStateEvent) => {
      if (e.state?.retentionTrap || !e.state) {
        setShow(true);
        window.history.pushState({ retentionTrap: true }, '');
      }
    };

    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  if (!show) return null;

  const pages = [
    { name: '퀴즈로 취향 찾기', url: '/quiz/' },
    { name: '오늘의 룰렛 돌리기', url: '/roulette/' },
    { name: 'VS 대결 해보기', url: '/vs/' },
    { name: '랭킹 확인하기', url: '/ranking/' },
  ];
  const suggestion = pages[Math.floor(Math.random() * pages.length)];

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 490, animation: 'rc-fade 0.3s' }}
        onClick={() => setShow(false)} />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '480px', zIndex: 491,
        background: '#FFF', borderRadius: '24px 24px 0 0',
        padding: '2rem 1.5rem', textAlign: 'center',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
        animation: 'rc-slideUp 0.4s ease-out',
      }}>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '0.5rem' }}>
          벌써 가시려고요?
        </p>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem' }}>
          이것만 해보고 가세요!
        </p>
        <a href={suggestion.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', background: '#8B5CF6', color: '#FFF',
          borderRadius: '14px', padding: '0.875rem', fontWeight: 700,
          textDecoration: 'none', fontSize: '0.95rem', marginBottom: '0.75rem',
        }}>{suggestion.name} →</a>
        <button onClick={() => setShow(false)} style={{
          background: 'none', border: 'none', color: '#999',
          fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>계속 둘러볼게요</button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes rc-slideUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}' }} />
    </>
  );
}

/* ── [R4] Micro-Reward Particles — 클릭마다 도파민 파티클 ──
   슬롯머신 원리: 모든 인터랙션에 시각적 보상 → 반복 행동 강화 */
function MicroRewardParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const nextId = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const texts = ['+1', '+1', '+1', '+2', '+3', '+5', '★', '♥'];
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 인터랙티브 요소 클릭 시에만
      if (target.closest('a, button, [role="button"]')) {
        const id = nextId.current++;
        const text = texts[Math.floor(Math.random() * texts.length)];
        setParticles(prev => [...prev, { id, x: e.clientX, y: e.clientY, text }]);
        setTimeout(() => {
          if (mountedRef.current) {
            setParticles(prev => prev.filter(p => p.id !== id));
          }
        }, 1200);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed', left: p.x, top: p.y,
          zIndex: 9999, pointerEvents: 'none',
          color: '#8B5CF6', fontWeight: 800, fontSize: '1rem',
          animation: 'rc-float 1.2s ease-out forwards',
          textShadow: '0 1px 4px rgba(139,92,246,0.3)',
        }}>{p.text}</div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rc-float{
          0%{opacity:1;transform:translateY(0) scale(1)}
          50%{opacity:0.8;transform:translateY(-30px) scale(1.3)}
          100%{opacity:0;transform:translateY(-60px) scale(0.8)}
        }
      `}} />
    </>
  );
}

/* ── [R5] Dopamine Combo — 연속 클릭 콤보 시스템 ──
   틱톡 원리: 빠른 연속 행동 시 보상 증폭 → "한 번 더" 심리 */
function DopamineCombo() {
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handler = () => {
      setCombo(c => {
        const next = c + 1;
        if (next >= 3) {
          setShowCombo(true);
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setShowCombo(false), 2000);
          const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
          sessionStorage.setItem('engagement_score', String(s + next));
        }
        return next;
      });
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { setCombo(0); setShowCombo(false); }, 3000);
    };
    document.addEventListener('click', handler);
    return () => { document.removeEventListener('click', handler); clearTimeout(timerRef.current); };
  }, []);

  if (!showCombo || combo < 3) return null;

  const label = combo >= 20 ? 'LEGENDARY!' : combo >= 10 ? 'UNSTOPPABLE!' : combo >= 5 ? 'COMBO!' : 'NICE!';
  const color = combo >= 20 ? '#F59E0B' : combo >= 10 ? '#EC4899' : combo >= 5 ? '#8B5CF6' : '#6D28D9';

  return (
    <div style={{
      position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 300, background: color, color: '#FFF',
      padding: '0.4rem 1.25rem', borderRadius: '50px',
      fontWeight: 800, fontSize: '0.85rem',
      boxShadow: `0 4px 20px ${color}66`,
      animation: 'rc-comboIn 0.3s ease-out',
      pointerEvents: 'none',
    }}>
      {combo}x {label}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes rc-comboIn{from{opacity:0;transform:translateX(-50%) scale(0.5)}to{opacity:1;transform:translateX(-50%) scale(1)}}' }} />
    </div>
  );
}

/* ── [R6] Expiring Content — 시간 제한 콘텐츠 ──
   슬롯머신 원리: 희소성 + 긴급성 → "지금 안 보면 사라진다" */
function ExpiringContent() {
  const [remaining, setRemaining] = useState(0);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 세션 시작 후 120초에 표시, 300초 카운트다운
    const showTimer = setTimeout(() => {
      setShow(true);
      setRemaining(300);
    }, 120000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!show || remaining <= 0) return;
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, [show, remaining]);

  if (!show || dismissed || remaining <= 0) return null;

  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  return (
    <div style={{
      position: 'fixed', top: '48px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 170, maxWidth: '360px', width: 'calc(100% - 2rem)',
      background: remaining < 60 ? 'linear-gradient(135deg, #DC2626, #EF4444)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
      borderRadius: '16px', padding: '0.6rem 1rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      animation: remaining < 60 ? 'rc-urgentPulse 1s infinite' : 'rc-slideDown 0.4s ease-out',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>한정 추천</p>
        <p style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 800 }}>
          {min}:{sec.toString().padStart(2, '0')} 후 사라집니다
        </p>
      </div>
      <a href="/quiz/" target="_blank" rel="noopener noreferrer" style={{
        background: '#FFF', color: remaining < 60 ? '#DC2626' : '#D97706',
        padding: '0.4rem 0.875rem', borderRadius: '10px',
        fontWeight: 700, textDecoration: 'none', fontSize: '0.8rem',
        whiteSpace: 'nowrap',
      }}>확인 →</a>
      <button onClick={() => setDismissed(true)} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
        fontSize: '1rem', cursor: 'pointer', padding: '0 0.25rem',
      }}>×</button>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rc-slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes rc-urgentPulse{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.02)}}
      `}} />
    </div>
  );
}

/* ── [R7] Achievement Badge System — 뱃지 수집 ──
   넷플릭스 원리: 완료 욕구 + 수집 욕구 → "하나만 더 모으면..." */
function AchievementSystem() {
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    const earned = JSON.parse(localStorage.getItem('earned_badges') || '[]');
    setBadgeCount(earned.length);

    const badges = [
      { id: 'first_visit', name: '첫 발걸음', condition: () => true },
      { id: 'night_owl', name: '올빼미', condition: () => { const h = new Date().getHours(); return h >= 22 || h < 5; } },
      { id: 'explorer_3', name: '탐험가', condition: () => {
        const recent = JSON.parse(localStorage.getItem('recent_venues') || '[]');
        return recent.length >= 3;
      }},
      { id: 'streak_3', name: '3일 연속', condition: () => {
        return parseInt(localStorage.getItem('streak_count') || '0') >= 3;
      }},
      { id: 'scroll_master', name: '스크롤 마스터', condition: () => {
        return parseInt(sessionStorage.getItem('engagement_score') || '0') >= 100;
      }},
      { id: 'weekend_warrior', name: '주말 전사', condition: () => {
        const day = new Date().getDay();
        return day === 5 || day === 6;
      }},
    ];

    let badgeTimer: ReturnType<typeof setTimeout>;
    for (const badge of badges) {
      if (!earned.includes(badge.id) && badge.condition()) {
        earned.push(badge.id);
        localStorage.setItem('earned_badges', JSON.stringify(earned));
        setBadgeCount(earned.length);
        setNewBadge(badge.name);
        badgeTimer = setTimeout(() => setNewBadge(null), 3500);
        break; // 한 번에 하나씩만
      }
    }
    return () => clearTimeout(badgeTimer);
  }, []);

  if (!newBadge) return null;

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)', zIndex: 350,
      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      color: '#FFF', padding: '2rem 2.5rem', borderRadius: '24px',
      textAlign: 'center', boxShadow: '0 20px 60px rgba(139,92,246,0.4)',
      animation: 'rc-badgePop 0.5s ease-out',
    }}>
      <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</p>
      <p style={{ fontSize: '0.75rem', color: '#C4B5FD', fontWeight: 600, marginBottom: '0.25rem' }}>뱃지 획득!</p>
      <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{newBadge}</p>
      <p style={{ fontSize: '0.75rem', color: '#C4B5FD', marginTop: '0.5rem' }}>
        총 {badgeCount}개 수집 완료
      </p>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes rc-badgePop{from{opacity:0;transform:translate(-50%,-50%) scale(0.3) rotate(-10deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0deg)}}' }} />
    </div>
  );
}

/* ── [R8] Curiosity Gap Teaser — 호기심 갭 ──
   틱톡 원리: "다음에 뭐가 나올지" 궁금증 → 스크롤 지속 */
function CuriosityGapTeaser() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let shown = false;
    const handler = () => {
      if (shown || dismissed) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? window.scrollY / h : 0;
      if (pct >= 0.3 && pct <= 0.5) {
        shown = true;
        setShow(true);
        hideTimerRef.current = setTimeout(() => setShow(false), 5000);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => { window.removeEventListener('scroll', handler); clearTimeout(hideTimerRef.current); };
  }, [dismissed]);

  if (!show || dismissed) return null;

  const teasers = [
    '아래에 숨겨진 잭팟 슬롯이 있다...',
    '스크롤 더 내리면 오늘의 운세가 기다려요',
    '끝까지 가면 미스터리 박스가 열립니다',
    '조금만 더 내리면 특별 추천이 나타나요',
  ];

  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '50%',
      transform: 'translateX(-50%)', zIndex: 130,
      background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
      color: '#FFF', padding: '0.6rem 1.25rem', borderRadius: '50px',
      fontSize: '0.8rem', fontWeight: 600,
      boxShadow: '0 8px 24px rgba(30,27,75,0.3)',
      animation: 'rc-teaserIn 0.4s ease-out',
      maxWidth: '90%', textAlign: 'center',
      cursor: 'pointer',
    }} onClick={() => { setDismissed(true); window.scrollBy({ top: 500, behavior: 'smooth' }); }}>
      ↓ {teasers[Math.floor(Math.random() * teasers.length)]}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes rc-teaserIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}' }} />
    </div>
  );
}

/* ── [R9] Social Ranking — 사회적 비교 ──
   틱톡 원리: "상위 N%에 속합니다" → 경쟁심 자극 → 더 많이 탐색 */
function SocialRanking() {
  const [show, setShow] = useState(false);
  const [rank, setRank] = useState('');
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      const score = parseInt(sessionStorage.getItem('engagement_score') || '0');
      if (score >= 30) {
        const pct = score >= 200 ? 1 : score >= 100 ? 3 : score >= 50 ? 8 : 15;
        setRank(`상위 ${pct}%`);
        setShow(true);
        hideTimerRef.current = setTimeout(() => setShow(false), 4000);
      }
    }, 60000); // 1분 후
    return () => { clearTimeout(timer); clearTimeout(hideTimerRef.current); };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '140px', right: '8px', zIndex: 175,
      background: 'linear-gradient(135deg, #059669, #10B981)',
      color: '#FFF', padding: '0.6rem 1rem', borderRadius: '16px',
      fontSize: '0.8rem', fontWeight: 700,
      boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
      animation: 'rc-slideLeft 0.4s ease-out', maxWidth: '180px',
    }}>
      <p style={{ fontSize: '0.65rem', color: '#A7F3D0', marginBottom: '0.15rem' }}>오늘의 탐험 순위</p>
      <p style={{ fontSize: '1rem' }}>🏅 {rank}</p>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes rc-slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}' }} />
    </div>
  );
}

/* ── [R10] Loss Aversion Timer — 손실 회피 ──
   슬롯머신 원리: "이미 얻은 것을 잃을 수 있다" → 이탈 방지 */
function LossAversionTimer() {
  const [show, setShow] = useState(false);
  const [bonus, setBonus] = useState(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // 5분 체류 시 보너스 적립 알림
    const timer = setTimeout(() => {
      const earned = parseInt(sessionStorage.getItem('engagement_score') || '0');
      if (earned >= 20) {
        setBonus(earned);
        setShow(true);
        hideTimerRef.current = setTimeout(() => setShow(false), 5000);
      }
    }, 300000); // 5분
    return () => { clearTimeout(timer); clearTimeout(hideTimerRef.current); };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)', zIndex: 260,
      background: '#FFF', border: '2px solid #F59E0B',
      borderRadius: '24px', padding: '1.5rem 2rem',
      textAlign: 'center', boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
      animation: 'rc-pop 0.4s ease-out', maxWidth: '300px', width: '85%',
    }}>
      <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</p>
      <p style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
        {bonus}P 적립 중!
      </p>
      <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5 }}>
        계속 탐험하면 포인트가 계속 쌓여요.<br />
        떠나면 오늘 적립이 끝납니다.
      </p>
    </div>
  );
}

/* ── [R11] Content Drip Reveal — 시간 경과 콘텐츠 해금 ──
   넷플릭스 원리: "다음 에피소드가 곧 열립니다" → 기다리게 만듦 */
function ContentDripReveal() {
  const [unlocked, setUnlocked] = useState(0);
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const gates = [
      { sec: 30, msg: '추천 알고리즘 활성화!' },
      { sec: 90, msg: '인기 트렌드 해금!' },
      { sec: 180, msg: '핵심 추천 해금!' },
      { sec: 360, msg: '시크릿 콘텐츠 해금!' },
    ];

    let elapsed = 0;
    const iv = setInterval(() => {
      elapsed++;
      const gate = gates.find(g => g.sec === elapsed);
      if (gate) {
        setUnlocked(u => u + 1);
        setToast(gate.msg);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(''), 3000);
      }
    }, 1000);
    return () => { clearInterval(iv); clearTimeout(toastTimerRef.current); };
  }, []);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', top: '100px', left: '50%',
      transform: 'translateX(-50%)', zIndex: 200,
      background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
      color: '#FFF', padding: '0.75rem 1.5rem', borderRadius: '50px',
      fontWeight: 700, fontSize: '0.85rem',
      boxShadow: '0 8px 24px rgba(139,92,246,0.3)',
      animation: 'rc-unlockPop 0.5s ease-out',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}>
      <span style={{ fontSize: '1.1rem' }}>🔓</span>
      {toast}
      <span style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '0.25rem' }}>({unlocked}/4)</span>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes rc-unlockPop{from{opacity:0;transform:translateX(-50%) translateY(-10px) scale(0.9)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}' }} />
    </div>
  );
}

/* ── [R12] Return Visit Welcome — 재방문 환영 ──
   넷플릭스 원리: "지난번에 여기까지 봤죠" → 연속성 → 재방문 동기 */
function ReturnVisitWelcome() {
  const [show, setShow] = useState(false);
  const [lastVisit, setLastVisit] = useState('');
  const [venueCount, setVenueCount] = useState(0);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const last = localStorage.getItem('last_visit_date');
    const today = new Date().toDateString();

    if (last && last !== today) {
      const recent = JSON.parse(localStorage.getItem('recent_venues') || '[]');
      setVenueCount(recent.length);

      const lastDate = new Date(last);
      const diff = Math.floor((Date.now() - lastDate.getTime()) / 86400000);
      setLastVisit(diff === 1 ? '어제' : `${diff}일 전`);

      setShow(true);
      hideTimer = setTimeout(() => setShow(false), 5000);
    }
    localStorage.setItem('last_visit_date', today);
    return () => clearTimeout(hideTimer);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)', zIndex: 280,
      background: '#FFF', borderRadius: '24px', padding: '2rem',
      textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
      animation: 'rc-pop 0.5s ease-out', maxWidth: '320px', width: '85%',
    }}>
      <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👋</p>
      <h3 style={{ fontWeight: 800, color: '#111', marginBottom: '0.5rem' }}>다시 왔군요!</h3>
      <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, marginBottom: '0.75rem' }}>
        {lastVisit} 방문 이후 {venueCount > 0 ? `${venueCount}곳을 둘러봤어요.` : '새로운 추천이 준비되었어요.'}
      </p>
      <p style={{ fontSize: '0.8rem', color: '#8B5CF6', fontWeight: 700 }}>
        오늘은 어디를 탐험할까요?
      </p>
    </div>
  );
}

/* ── [R13] Scroll Velocity Reward — 스크롤 속도 보상 ──
   틱톡 원리: 빠르게 스와이프할수록 보상 → 스크롤 습관 강화 */
function ScrollVelocityReward() {
  const [reward, setReward] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = Date.now();
    let shown = new Set<string>();

    const handler = () => {
      const now = Date.now();
      const dt = now - lastT;
      if (dt > 0 && dt < 500) {
        const speed = Math.abs(window.scrollY - lastY) / dt;
        if (speed > 3 && !shown.has('fast')) {
          shown.add('fast');
          setReward('⚡ 고속 스크롤! +3P');
          const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
          sessionStorage.setItem('engagement_score', String(s + 3));
          setTimeout(() => {
            if (mountedRef.current) {
              setReward('');
            }
          }, 2000);
        }
      }
      lastY = window.scrollY;
      lastT = now;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!reward) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '60px', left: '50%',
      transform: 'translateX(-50%)', zIndex: 190,
      background: '#111', color: '#FFF',
      padding: '0.5rem 1.25rem', borderRadius: '50px',
      fontSize: '0.8rem', fontWeight: 700,
      animation: 'rc-teaserIn 0.3s ease-out',
      pointerEvents: 'none',
    }}>
      {reward}
    </div>
  );
}

/* ── [R14] Endless Loop Trigger — 끝 도달 시 자동 순환 ──
   틱톡 원리: 피드가 끝나지 않는다 → 다른 페이지로 자동 유도 */
function EndlessLoopTrigger() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 300 && window.scrollY / h >= 0.95) {
        setShow(true);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!show) return null;

  const loopPages = [
    { name: '퀴즈', url: '/quiz/', desc: '취향 테스트 해보세요' },
    { name: 'VS 대결', url: '/vs/', desc: '어디가 더 좋을까?' },
    { name: '룰렛', url: '/roulette/', desc: '운명의 장소, 돌려보자' },
    { name: '랭킹', url: '/ranking/', desc: '인기 순위 확인' },
    { name: '갤러리', url: '/gallery/', desc: '분위기 미리보기' },
    { name: '매거진', url: '/magazine/', desc: '읽을거리' },
  ];
  const picks = loopPages.sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div style={{
      margin: '2rem auto', maxWidth: '460px', padding: '0 1rem',
      animation: 'rc-fade 0.5s',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
        border: '2px solid #8B5CF6', borderRadius: '24px',
        padding: '1.5rem', textAlign: 'center',
      }}>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '0.25rem' }}>
          여기가 끝이 아니에요!
        </p>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
          아직 안 해본 것들이 있다
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {picks.map(p => (
            <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', padding: '0.75rem 1rem',
              background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '12px',
              textDecoration: 'none', textAlign: 'left',
            }}>
              <span style={{ fontWeight: 700, color: '#6D28D9', fontSize: '0.9rem' }}>{p.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>{p.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
