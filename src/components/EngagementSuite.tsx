'use client';
import { useState, useEffect, useRef } from 'react';
import { Venue } from '@/lib/venues';

/* ── 오늘 N명이 봤습니다 카운터 ── */
export function ViewCounter({ slug }: { slug: string }) {
  const [count] = useState(() => {
    let h = 5381;
    for (let i = 0; i < slug.length; i++) h = ((h << 5) + h + slug.charCodeAt(i)) | 0;
    const base = Math.abs(h) % 400 + 120;
    const hour = new Date().getHours();
    return base + (hour > 20 ? 180 : hour > 17 ? 90 : 30);
  });
  return (
    <div style={{ textAlign: 'center', padding: '0.75rem', background: '#FEF3C7', borderRadius: '12px', margin: '1rem 0', fontSize: '0.9rem', color: '#92400E', fontWeight: 600 }}>
      오늘 {count}명이 이 페이지를 봤습니다
    </div>
  );
}

/* ── 이 업소의 비밀 (80% 스크롤 시 등장) ── */
export function SecretReveal({ name, catSlug }: { name: string; catSlug: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (pct > 0.75 && !show) setShow(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [show]);

  const secrets: Record<string, string[]> = {
    club: ['평일 수요일이 가장 여유롭다', '바 카운터 왼쪽이 음향 최적 자리다', '오픈 직후 30분이 입장 가장 빠르다'],
    night: ['금요일보다 목요일 밤이 분위기가 좋다', '밴드에게 신청곡을 넣을 수 있다', '22시 이전 도착하면 자리 선택권이 넓다'],
    lounge: ['바텐더에게 취향만 말하면 숨은 메뉴가 나온다', '평일 화요일이 가장 한적하다', '카운터석이 대화하기 가장 좋은 자리다'],
    room: ['전화 예약 시 VIP룸을 요청할 수 있다', '기념일이면 장식 세팅을 해준다', '평일 저녁이 가장 넉넉하게 쓸 수 있다'],
    yojeong: ['제철 메뉴를 미리 물어보면 으뜸 코스가 나온다', '국악 공연은 예약 시 별도 요청이 필요하다'],
    hoppa: ['첫 방문이면 매니저에게 솔직히 말하자', '평일 저녁이 가장 편안하다', '호스트 교체는 자유롭게 요청 가능하다'],
  };
  const pool = secrets[catSlug] || secrets.club;
  let h = 5381;
  for (let i = 0; i < name.length; i++) h = ((h << 5) + h + name.charCodeAt(i)) | 0;
  const secret = pool[Math.abs(h) % pool.length];

  if (!show) return null;
  return (
    <div style={{ background: 'linear-gradient(135deg, #1E1B4B, #312E81)', borderRadius: '16px', padding: '1.5rem', margin: '2rem 0', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
      <p style={{ color: '#FCD34D', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>SECRET</p>
      <p style={{ color: '#E0E7FF', fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 }}>{secret}</p>
    </div>
  );
}

/* ── VS 투표 ── */
export function VsVote({ a, b }: { a: Venue; b: Venue }) {
  const [vote, setVote] = useState<'a' | 'b' | null>(null);
  const total = 100;
  const aVotes = vote === 'a' ? 58 : vote === 'b' ? 42 : 0;

  return (
    <div style={{ background: '#F7F7F8', borderRadius: '16px', padding: '1.5rem', margin: '2rem 0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1rem' }}>어디가 더 끌려?</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[{ v: a, key: 'a' as const }, { v: b, key: 'b' as const }].map(({ v, key }) => (
          <button key={key} onClick={() => setVote(key)} style={{
            padding: '1rem', borderRadius: '12px', border: vote === key ? '2px solid #4F46E5' : '1px solid #E5E7EB',
            background: vote === key ? '#EEF2FF' : '#FFF', cursor: 'pointer', textAlign: 'center',
          }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '0.25rem' }}>{v.name}</p>
            <p style={{ fontSize: '0.75rem', color: '#666' }}>{v.region}</p>
            {vote && <p style={{ marginTop: '0.5rem', fontWeight: 700, color: '#4F46E5', fontSize: '1.1rem' }}>{key === 'a' ? aVotes : total - aVotes}%</p>}
          </button>
        ))}
      </div>
      {vote && <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#666' }}>투표 완료! 총 {total}명 참여</p>}
    </div>
  );
}

/* ── 오늘의 운세 ── */
export function DailyFortune({ catSlug }: { catSlug: string }) {
  const [revealed, setRevealed] = useState(false);
  const fortunes: Record<string, string[]> = {
    club: ['오늘 플로어 에너지가 최고조인 날. 자정 넘겨서 가라.', '바 카운터에서 좋은 인연이 기다린다.', 'DJ가 네 취향 저격하는 날이다.'],
    night: ['오늘은 테이블 앞자리가 행운석이다.', '밴드의 마지막 곡에 기대해도 좋다.', '오랜만에 만난 사람과 좋은 대화가 오갈 날.'],
    lounge: ['바텐더 추천 칵테일이 정답인 날.', '창가 자리에서 좋은 시간을 보낼 수 있다.', '오늘은 평소 안 마시던 걸 시도해볼 때.'],
    room: ['넉넉한 사이즈 방을 잡으면 만족도가 올라간다.', '분위기 메이커가 되면 모임이 성공한다.'],
    yojeong: ['코스 요리의 마지막 디저트가 하이라이트다.', '좌석을 상석으로 안내받을 날.'],
    hoppa: ['첫인상 좋은 호스트를 만날 확률이 높다.', '오늘은 친구와 함께 가면 더 즐겁다.'],
  };
  const pool = fortunes[catSlug] || fortunes.club;
  const today = new Date().getDate();
  const fortune = pool[today % pool.length];

  return (
    <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: '16px', padding: '1.25rem', margin: '1.5rem 0', textAlign: 'center' }}>
      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C2410C', marginBottom: '0.5rem' }}>오늘의 밤 운세</p>
      {revealed ? (
        <p style={{ fontSize: '0.95rem', color: '#111', lineHeight: 1.6 }}>{fortune}</p>
      ) : (
        <button onClick={() => setRevealed(true)} style={{ background: '#EA580C', color: '#FFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
          운세 확인하기
        </button>
      )}
    </div>
  );
}

/* ── 무한스크롤 추천 ── */
export function InfiniteRecommend({ venues }: { venues: Venue[] }) {
  const [shown, setShown] = useState(3);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && shown < venues.length) {
        setShown(prev => Math.min(prev + 3, venues.length));
      }
    }, { threshold: 0.1 });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [shown, venues.length]);

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>멈출 수 없는 추천</h3>
      {venues.slice(0, shown).map((v, i) => (
        <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #E5E7EB', textDecoration: 'none', color: '#111' }}>
          <span style={{ minWidth: '28px', fontWeight: 800, color: '#4F46E5' }}>{i + 1}</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.name}</p>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>{v.region} · {v.card_hook?.slice(0, 30)}</p>
          </div>
        </a>
      ))}
      {shown < venues.length && <div ref={loaderRef} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>더 불러오는 중...</div>}
    </div>
  );
}

/* ── 스와이프 갤러리 ── */
export function SwipeGallery({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const handleStart = (x: number) => { startX.current = x; };
  const handleEnd = (x: number) => {
    const diff = startX.current - x;
    if (Math.abs(diff) > 50) {
      setIdx(prev => diff > 0 ? Math.min(prev + 1, images.length - 1) : Math.max(prev - 1, 0));
    }
  };

  return (
    <div style={{ margin: '1.5rem 0', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}
      onTouchStart={e => handleStart(e.touches[0].clientX)}
      onTouchEnd={e => handleEnd(e.changedTouches[0].clientX)}
      onMouseDown={e => handleStart(e.clientX)}
      onMouseUp={e => handleEnd(e.clientX)}
    >
      <img src={images[idx]} alt={`${name} ${idx + 1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', background: '#E5E7EB', userSelect: 'none' }} draggable={false} />
      <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', background: i === idx ? '#FFF' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: '8px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#FFF', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px' }}>{idx + 1}/{images.length}</div>
    </div>
  );
}
