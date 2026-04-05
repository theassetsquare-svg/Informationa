'use client';

import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════
   95분 체류 글로벌 시스템 — layout.tsx에서 모든 페이지 자동 적용
   틱톡: 끊을 수 없는 루프 | 넷플릭스: 다음 추천 | 슬롯: 가변보상
   ═══════════════════════════════════════════════════════════ */

export default function GlobalEngagementBoost() {
  return (
    <>
      <PageChainTracker />
      <ScrollDepthReward />
      <BottomMysteryReveal />
      <TimeGatedUnlock />
      <SmartNextPage />
      <SessionScore />
      <IdleRecapture />
    </>
  );
}

/* ── [G1] 페이지 방문 체인 — 여러 페이지를 돌수록 콤보 보상 ── */
function PageChainTracker() {
  const [chain, setChain] = useState(0);
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    let bonusTimer: ReturnType<typeof setTimeout>;
    const countKey = 'page_chain_count';
    if (!sessionStorage.getItem('page_chain_session')) {
      sessionStorage.setItem('page_chain_session', '1');
    }
    const count = parseInt(sessionStorage.getItem(countKey) || '0') + 1;
    sessionStorage.setItem(countKey, String(count));
    setChain(count);
    if (count >= 3 && count % 3 === 0) {
      setShowBonus(true);
      bonusTimer = setTimeout(() => setShowBonus(false), 3000);
    }
    const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
    sessionStorage.setItem('engagement_score', String(s + 10));
    return () => clearTimeout(bonusTimer);
  }, []);

  if (chain < 2) return null;

  return (
    <>
      <div style={{
        position: 'fixed', top: '48px', left: '8px', zIndex: 90,
        background: chain >= 5 ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'rgba(255,255,255,0.95)',
        border: chain >= 5 ? 'none' : '1px solid #E5E7EB',
        borderRadius: '20px', padding: '0.3rem 0.7rem',
        fontSize: '0.7rem', fontWeight: 700,
        color: chain >= 5 ? '#FFF' : '#6D28D9',
        backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        {chain}페이지 연속 {chain >= 10 ? '🔥' : chain >= 5 ? '⚡' : ''}
      </div>
      {showBonus && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 300, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          color: '#FFF', padding: '1.5rem 2.5rem', borderRadius: '24px',
          textAlign: 'center', boxShadow: '0 20px 60px rgba(139,92,246,0.4)',
          animation: 'geb-pop 0.4s ease-out',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>+{chain * 5}P</p>
          <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{chain}페이지 콤보!</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>계속 탐험하세요</p>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes geb-pop{from{opacity:0;transform:translate(-50%,-50%) scale(0.5)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}' }} />
    </>
  );
}

/* ── [G2] 스크롤 깊이 보상 — 25/50/75/100% 도달 시 도파민 ── */
function ScrollDepthReward() {
  const [toast, setToast] = useState('');
  const [hit, setHit] = useState<Set<number>>(new Set());
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const rewards = [
      { d: 25, msg: '25% 탐색 완료! 아직 숨겨진 정보가 남았어요' },
      { d: 50, msg: '절반 돌파! 거의 전문가 수준이에요' },
      { d: 75, msg: '75%! 끝까지 가면 미스터리 박스가 있어요' },
      { d: 100, msg: '완독 달성! 이 페이지를 정복했다' },
    ];
    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (h > 100) {
          const pct = Math.round((window.scrollY / h) * 100);
          for (const r of rewards) {
            if (pct >= r.d && !hit.has(r.d)) {
              setHit(prev => new Set(prev).add(r.d));
              setToast(r.msg);
              const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
              sessionStorage.setItem('engagement_score', String(s + r.d));
              clearTimeout(toastTimerRef.current);
              toastTimerRef.current = setTimeout(() => setToast(''), 3000);
              break;
            }
          }
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      clearTimeout(toastTimerRef.current);
    };
  }, [hit]);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '148px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 180, background: '#111', color: '#FFF',
      padding: '0.6rem 1.25rem', borderRadius: '50px',
      fontSize: '0.8rem', fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      animation: 'geb-up 0.4s ease-out', maxWidth: '90%', textAlign: 'center',
    }}>
      {toast}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes geb-up{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}' }} />
    </div>
  );
}

/* ── [G3] 바닥 미스터리 박스 — 끝까지 스크롤하면 보상 ── */
function BottomMysteryReveal() {
  const [reached, setReached] = useState(false);
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState('');

  useEffect(() => {
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 200 && window.scrollY / h >= 0.92) setReached(true);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const openBox = () => {
    const rewards = [
      '🎯 비밀 팁: 금요일 23시가 가장 뜨거운 시간!',
      '💎 발견! 매주 화요일은 한산해서 VIP 대접받는 날',
      '🎰 보너스! 다음 슬롯에서 잭팟 확률 UP',
      '👑 축하! 끝까지 온 당신은 밤의 탐험가',
      '🔥 힌트: 강남 23시, 압구정 24시가 피크타임',
      '⭐ 꿀팁: 전화 예약하면 대기 없이 바로 입장',
    ];
    setReward(rewards[Math.floor(Math.random() * rewards.length)]);
    setOpened(true);
    const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
    sessionStorage.setItem('engagement_score', String(s + 50));
  };

  if (!reached) return null;

  return (
    <div style={{ margin: '2rem auto', maxWidth: '460px', padding: '0 1rem' }}>
      {!opened ? (
        <button onClick={openBox} style={{
          display: 'block', width: '100%', padding: '1.25rem',
          background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
          border: 'none', borderRadius: '20px', cursor: 'pointer',
          color: '#FFF', textAlign: 'center',
          boxShadow: '0 8px 32px rgba(30,27,75,0.3)',
          animation: 'geb-pulse 2s infinite',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</p>
          <p style={{ fontWeight: 700, fontSize: '1rem' }}>미스터리 박스 발견!</p>
          <p style={{ fontSize: '0.8rem', color: '#A5B4FC', marginTop: '0.25rem' }}>끝까지 온 당신에게 드리는 보상</p>
        </button>
      ) : (
        <div style={{
          padding: '1.5rem', background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          border: '2px solid #F59E0B', borderRadius: '20px', textAlign: 'center',
          animation: 'fadeIn 0.5s',
        }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>+50P</p>
          <p style={{ fontWeight: 700, color: '#92400E', fontSize: '0.95rem', lineHeight: 1.6 }}>{reward}</p>
          <p style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '0.75rem' }}>다른 페이지에서도 미스터리 박스를 찾아보세요!</p>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes geb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}' }} />
    </div>
  );
}

/* ── [G4] 시간 기반 해금 — 체류할수록 콘텐츠 해금 알림 ── */
function TimeGatedUnlock() {
  const [sec, setSec] = useState(0);
  const [toast, setToast] = useState('');
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let toastTimer: ReturnType<typeof setTimeout>;
    const gates = [
      { at: 120, msg: '🔓 2분 보너스! 숨겨진 추천이 해금됩니다' },
      { at: 300, msg: '🔓 5분 달성! VIP 정보 열쇠 획득' },
      { at: 600, msg: '🔓 10분 마스터! 숨은 팁 활성화' },
      { at: 1200, msg: '🔓 20분 전설! 밤의 대가 칭호 획득' },
      { at: 2400, msg: '🔓 40분! 오늘의 최강 탐험가 등극' },
      { at: 3600, msg: '🔓 60분! 밤문화 학자 — 대단합니다!' },
      { at: 5400, msg: '🔓 90분! 닥터 나이트라이프 전설 등극!' },
    ];
    const gate = gates.find(g => g.at === sec);
    if (gate && !unlocked.has(gate.at)) {
      setUnlocked(prev => new Set(prev).add(gate.at));
      setToast(gate.msg);
      const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
      sessionStorage.setItem('engagement_score', String(s + gate.at / 10));
      toastTimer = setTimeout(() => setToast(''), 4000);
    }
    return () => clearTimeout(toastTimer);
  }, [sec, unlocked]);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      zIndex: 250, background: 'linear-gradient(135deg, #059669, #10B981)',
      color: '#FFF', padding: '1.25rem 2rem', borderRadius: '20px',
      textAlign: 'center', boxShadow: '0 16px 48px rgba(5,150,105,0.3)',
      animation: 'geb-pop 0.5s ease-out', maxWidth: '85%',
    }}>
      <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{toast}</p>
    </div>
  );
}

/* ── [G5] 스마트 다음 페이지 — 현재 URL 기반 추천 (90초 후) ── */
function SmartNextPage() {
  const [show, setShow] = useState(false);
  const [suggestion, setSuggestion] = useState({ text: '', url: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      const path = window.location.pathname;
      const map: [RegExp, string, string][] = [
        [/^\/$/, '퀴즈로 나에게 맞는 곳 찾기', '/quiz/'],
        [/^\/clubs/, '나이트와 비교해보세요', '/nights/'],
        [/^\/nights/, '클럽도 둘러보세요', '/clubs/'],
        [/^\/lounges/, '요정도 확인해보세요', '/yojeongs/'],
        [/^\/rooms/, '요정과 비교해보세요', '/yojeongs/'],
        [/^\/yojeongs/, '라운지도 비교해보세요', '/lounges/'],
        [/^\/hoppas/, '클럽과 비교해보세요', '/clubs/'],
        [/^\/quiz/, 'VS 대결로 비교하기', '/vs/'],
        [/^\/vs/, '랭킹 확인하기', '/ranking/'],
        [/^\/ranking/, '룰렛으로 운명의 장소', '/roulette/'],
        [/^\/roulette/, '지도로 근처 찾기', '/map/'],
        [/^\/map/, '갤러리 구경하기', '/gallery/'],
        [/^\/gallery/, '매거진 읽기', '/magazine/'],
        [/^\/magazine/, '드레스코드 확인', '/dress-code/'],
        [/^\/dress-code/, '안전 가이드 확인', '/safety/'],
        [/^\/safety/, '커뮤니티 참여하기', '/community/'],
        [/^\/community/, '홈으로 돌아가기', '/'],
        [/^\/chat/, '퀴즈로 성향 테스트', '/quiz/'],
        [/^\/events/, '매거진 읽기', '/magazine/'],
        [/^\/status/, '홈에서 전체 둘러보기', '/'],
        [/^\/club\//, '다른 클럽 비교', '/clubs/'],
        [/^\/night\//, '다른 나이트 비교', '/nights/'],
        [/^\/lounge\//, '다른 라운지 비교', '/lounges/'],
        [/^\/room\//, '다른 룸 비교', '/rooms/'],
        [/^\/yojeong\//, '다른 요정 비교', '/yojeongs/'],
        [/^\/hoppa\//, '다른 호빠 비교', '/hoppas/'],
      ];
      const found = map.find(([re]) => re.test(path));
      if (found) {
        setSuggestion({ text: found[1], url: found[2] });
        setShow(true);
      }
    }, 90000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '92px', left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px', zIndex: 160,
      background: 'linear-gradient(135deg, #111, #1E1B4B)',
      borderTop: '2px solid #8B5CF6', padding: '1rem 1.25rem', color: '#FFF',
      animation: 'slideUp 0.5s ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.7rem', color: '#A5B4FC', marginBottom: '0.25rem' }}>다음 추천</p>
          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{suggestion.text}</p>
        </div>
        <a href={suggestion.url} target="_blank" rel="noopener noreferrer" style={{
          background: '#8B5CF6', color: '#FFF', padding: '0.6rem 1.25rem',
          borderRadius: '10px', fontWeight: 700, textDecoration: 'none',
          fontSize: '0.85rem', whiteSpace: 'nowrap',
        }}>이동 →</a>
        <button onClick={() => setShow(false)} style={{
          background: 'none', border: 'none', color: '#999', fontSize: '1.2rem', cursor: 'pointer',
        }}>×</button>
      </div>
    </div>
  );
}

/* ── [G6] 세션 점수 위젯 — 총 엔게이지먼트 표시 ── */
function SessionScore() {
  const [score, setScore] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const update = () => setScore(parseInt(sessionStorage.getItem('engagement_score') || '0'));
    update();
    const iv = setInterval(update, 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = () => {
      const s = parseInt(sessionStorage.getItem('engagement_score') || '0');
      sessionStorage.setItem('engagement_score', String(s + 1));
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  if (score < 10) return null;

  const level = score >= 500 ? '👑 전설' : score >= 200 ? '💎 마스터' : score >= 100 ? '⭐ 탐험가' : score >= 50 ? '🔥 마니아' : '🎯 초보';
  const nextAt = score >= 500 ? 1000 : score >= 200 ? 500 : score >= 100 ? 200 : score >= 50 ? 100 : 50;

  return (
    <>
      <button onClick={() => setShowDetail(!showDetail)} style={{
        position: 'fixed', bottom: '196px', left: '8px', zIndex: 85,
        background: 'rgba(255,255,255,0.95)', border: '1px solid #E5E7EB',
        borderRadius: '16px', padding: '0.4rem 0.6rem',
        fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', color: '#6D28D9', fontWeight: 700,
      }}>
        {level} {score}P
      </button>
      {showDetail && (
        <div style={{
          position: 'fixed', bottom: '236px', left: '8px', zIndex: 86,
          background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '16px',
          padding: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          width: '180px', animation: 'fadeIn 0.3s',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111', marginBottom: '0.5rem' }}>탐험 점수</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6D28D9' }}>{score}P</p>
          <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
            페이지 이동·스크롤·클릭으로 획득
          </p>
          <div style={{ marginTop: '0.5rem', height: '4px', background: '#E5E7EB', borderRadius: '2px' }}>
            <div style={{ width: `${Math.min(100, (score / nextAt) * 100)}%`, height: '100%', background: '#8B5CF6', borderRadius: '2px', transition: 'width 0.5s' }} />
          </div>
          <p style={{ fontSize: '0.6rem', color: '#999', marginTop: '0.25rem' }}>
            다음 레벨까지 {Math.max(0, nextAt - score)}P
          </p>
        </div>
      )}
    </>
  );
}

/* ── [G7] 유휴 상태 재포착 — 45초 입력 없으면 ── */
function IdleRecapture() {
  const [idle, setIdle] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timeout);
      setIdle(false);
      timeout = setTimeout(() => setIdle(true), 45000);
    };
    reset();
    const opts = { passive: true } as const;
    window.addEventListener('mousemove', reset);
    window.addEventListener('touchstart', reset, opts);
    window.addEventListener('scroll', reset, opts);
    window.addEventListener('keydown', reset);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('touchstart', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('keydown', reset);
    };
  }, []);

  if (!idle || dismissed) return null;

  const prompts = [
    '아직 안 본 곳이 많아요! 계속 탐험할까요?',
    '잠깐, 이 페이지 아래에 숨겨진 정보가 있어요',
    '다른 카테고리도 둘러보시겠어요?',
    '지금 인기 급상승 중인 곳을 확인해보세요',
  ];

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      zIndex: 220, background: '#FFF', border: '2px solid #8B5CF6',
      borderRadius: '24px', padding: '2rem', textAlign: 'center',
      boxShadow: '0 24px 64px rgba(0,0,0,0.15)', maxWidth: '320px', width: '85%',
      animation: 'geb-pop 0.4s ease-out',
    }}>
      <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👋</p>
      <p style={{ fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '0.5rem' }}>
        {prompts[Math.floor(Math.random() * prompts.length)]}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={() => { setDismissed(true); window.scrollBy({ top: 300, behavior: 'smooth' }); }} style={{
          flex: 1, background: '#8B5CF6', color: '#FFF', border: 'none',
          borderRadius: '12px', padding: '0.75rem', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'var(--font-sans)', minHeight: '44px',
        }}>계속 탐험 →</button>
        <button onClick={() => setDismissed(true)} style={{
          flex: 1, background: '#F7F7F8', color: '#666', border: '1px solid #E5E7EB',
          borderRadius: '12px', padding: '0.75rem', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-sans)', minHeight: '44px',
        }}>닫기</button>
      </div>
    </div>
  );
}
