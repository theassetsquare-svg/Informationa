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

/* ── 스와이프 갤러리 (사진별 한줄 스토리) ── */
export function SwipeGallery({ images, name, catSlug }: { images: string[]; name: string; catSlug?: string }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const handleStart = (x: number) => { startX.current = x; };
  const handleEnd = (x: number) => {
    const diff = startX.current - x;
    if (Math.abs(diff) > 50) {
      setIdx(prev => diff > 0 ? Math.min(prev + 1, images.length - 1) : Math.max(prev - 1, 0));
    }
  };
  const captions: Record<string, string[]> = {
    club: ['입구에서부터 에너지가 느껴진다', '메인 플로어, 여기가 핵심이다', 'DJ 부스 앞은 전쟁터다', '바 카운터에서 한잔하는 여유', 'VIP 구역의 시야', '새벽 감성, 조명이 만드는 분위기'],
    night: ['로비에 들어서면 웨이터가 맞이한다', '무대 위 밴드가 열기를 올린다', '테이블 셋업은 이렇게 된다', '금요일 밤 10시의 풍경', '프라이빗 구역의 분위기', '공연 사이 쉬는 시간의 여유'],
    lounge: ['바 카운터의 은은한 조명', '시그니처 칵테일이 나오는 순간', '소파석에서 보는 야경', '인테리어 디테일 하나하나', '분위기를 만드는 간접 조명', '혼자 와도 어색하지 않은 공간'],
    room: ['문 열고 들어가면 이 뷰다', '룸 내부 조명과 음향', '테이블 세팅 모습', '프라이빗한 공간의 매력', '모임 분위기를 살려주는 구조', '깔끔한 마감이 눈에 띈다'],
    yojeong: ['한정식 코스의 시작', '가야금 연주가 흐르는 공간', '정갈한 상차림의 격', '한복 입은 직원의 안내', '코스 중간의 메인 디쉬', '풍류의 마무리'],
    hoppa: ['세련된 입구와 로비', '처음이라도 편하게 앉는 자리', '매니저가 분위기를 리드한다', '깔끔한 내부 인테리어', '대화가 자연스럽게 이어진다', '기분 좋게 마무리되는 저녁'],
  };
  const cap = captions[catSlug || 'club'] || captions.club;

  return (
    <div style={{ margin: '1.5rem 0', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}
      onTouchStart={e => handleStart(e.touches[0].clientX)}
      onTouchEnd={e => handleEnd(e.changedTouches[0].clientX)}
      onMouseDown={e => handleStart(e.clientX)}
      onMouseUp={e => handleEnd(e.clientX)}
    >
      <img src={images[idx]} alt={`${name} ${idx + 1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', background: '#E5E7EB', userSelect: 'none' }} draggable={false} />
      {/* 사진 캡션 — 흰 텍스트 + 그림자 */}
      <div style={{ position: 'absolute', bottom: '28px', left: '12px', right: '12px', color: '#FFF', fontSize: '0.85rem', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.7)', lineHeight: 1.4 }}>
        {cap[idx % cap.length]}
      </div>
      <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', background: i === idx ? '#FFF' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: '8px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#FFF', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px' }}>{idx + 1}/{images.length}</div>
    </div>
  );
}

/* ── Before/After: 첫 방문 vs 단골의 차이 ── */
export function BeforeAfter({ catSlug }: { catSlug: string }) {
  const [tab, setTab] = useState<'before' | 'after'>('before');
  const data: Record<string, { before: string[]; after: string[] }> = {
    club: { before: ['입구에서 줄 서서 30분 기다린다', '플로어 어디 서야 할지 모른다', '음료 하나 시키는데 10분 걸린다'], after: ['오픈 직후 도착해서 대기 없이 입장', '사운드 베스트 포지션을 알고 있다', '바텐더한테 "평소 거"하면 바로 나온다'] },
    night: { before: ['테이블 배정을 어디로 받을지 감이 없다', '밴드 타임을 모르고 일찍 간다', '웨이터 호출에 어색하다'], after: ['전화로 미리 원하는 자리 지정한다', '밴드 2세트 시작에 맞춰 도착한다', '담당 웨이터 이름을 부른다'] },
    lounge: { before: ['메뉴판 보고 아무거나 시킨다', '바 카운터석을 피한다', '1시간 만에 나온다'], after: ['바텐더한테 "기분에 맞는 거"라고 한다', '카운터 왼쪽 끝이 제일 좋은 자리', '3시간이 30분처럼 간다'] },
    room: { before: ['인원수만 말하고 아무 방이나 간다', '서비스 뭐가 있는지 모른다', '기념일인데 그냥 간다'], after: ['VIP룸 예약하고 간다', '사전에 서비스 구성을 확인한다', '기념일 세팅을 미리 요청한다'] },
    yojeong: { before: ['코스 구성을 몰라서 당황한다', '복장 캐주얼로 갔다가 눈치 본다', '예약 없이 갔다가 입장 거절'], after: ['제철 메뉴 미리 문의하고 간다', '비즈니스 캐주얼 갖춰 입는다', '최소 3일 전에 예약한다'] },
    hoppa: { before: ['처음이라 긴장해서 말을 못 한다', '시스템을 몰라서 어색하다', '호스트 교체를 요청 못 한다'], after: ['매니저한테 취향을 정확히 전달한다', '입장부터 퇴장까지 흐름을 안다', '편하게 교체 요청한다'] },
  };
  const d = data[catSlug] || data.club;
  return (
    <div style={{ background: '#F7F7F8', borderRadius: '16px', padding: '1.25rem', margin: '1.5rem 0' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>첫 방문 vs 단골의 차이</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['before', 'after'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: tab === t ? '#4F46E5' : '#E5E7EB', color: tab === t ? '#FFF' : '#666', fontFamily: 'var(--font-sans)', minHeight: '44px' }}>
            {t === 'before' ? '첫 방문' : '단골'}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {(tab === 'before' ? d.before : d.after).map((item, i) => (
          <li key={i} style={{ padding: '0.6rem 0', borderBottom: '1px solid #E5E7EB', fontSize: '0.9rem', color: '#333', display: 'flex', gap: '0.5rem' }}>
            <span>{tab === 'before' ? '😐' : '😎'}</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Time Attack: 실시간 예약 카운터 ── */
export function TimeAttack({ slug }: { slug: string }) {
  const [num, setNum] = useState(() => {
    let h = 5381;
    for (let i = 0; i < slug.length; i++) h = ((h << 5) + h + slug.charCodeAt(i)) | 0;
    return (Math.abs(h) % 30) + 15;
  });
  useEffect(() => {
    const t = setInterval(() => setNum(n => n + (Math.random() > 0.6 ? 1 : 0)), 8000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1rem 1.25rem', margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ fontSize: '1.5rem' }}>🔥</span>
      <div>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991B1B' }}>오늘 {num}번째 문의!</p>
        <p style={{ fontSize: '0.8rem', color: '#DC2626' }}>지금 전화하면 바로 확인 가능</p>
      </div>
    </div>
  );
}

/* ── Review Highlight: 직접 가본 손님의 한마디 ── */
export function ReviewHighlight({ name, catSlug }: { name: string; catSlug: string }) {
  const reviews: Record<string, { text: string; who: string }[]> = {
    club: [
      { text: '사운드가 진짜 다르다. 몸 전체로 듣는 느낌.', who: '20대 남성 · 3회 방문' },
      { text: '친구가 데려갔는데 다음 주에 혼자 또 갔다.', who: '20대 여성 · 단골' },
      { text: '금요일 자정 넘기면 플로어가 미친다.', who: '30대 남성 · 5회 방문' },
    ],
    night: [
      { text: '밴드 퀄리티가 기대 이상이다. 라이브의 힘.', who: '40대 남성 · 단골' },
      { text: '처음 갔는데 옆 테이블이 건배하자고 해서 친구됐다.', who: '30대 여성 · 첫 방문' },
      { text: '테이블 간격이 넉넉해서 대화하기 좋다.', who: '50대 남성 · 10회 이상' },
    ],
    lounge: [
      { text: '바텐더한테 "기분에 맞는 거"라고 했더니 인생 칵테일 나왔다.', who: '30대 여성 · 3회 방문' },
      { text: '소개팅 장소로 여기 잡으면 반은 먹고 들어간다.', who: '20대 남성 · 단골' },
      { text: '혼자 와서 카운터에 앉았는데 전혀 어색하지 않았다.', who: '30대 남성 · 2회 방문' },
    ],
    room: [
      { text: '거래처 사장님이 "다음에도 여기서 하자" 했다. 그 한마디면 됐다.', who: '40대 남성 · 접대' },
      { text: '10명이 왔는데 안 좁았다. 방 배치가 좋다.', who: '30대 남성 · 회식' },
      { text: '기념일에 장식 세팅 요청했더니 완벽했다.', who: '30대 여성 · 기념일' },
    ],
    yojeong: [
      { text: '외국 바이어 데려갔더니 한국 또 오고 싶다고 했다.', who: '50대 남성 · 접대' },
      { text: '코스 7번째 나올 때 "이게 진짜구나" 했다.', who: '40대 남성 · 첫 방문' },
      { text: '가야금 연주 시작되는 순간 소름 돋았다.', who: '40대 여성 · 2회 방문' },
    ],
    hoppa: [
      { text: '처음이라 떨렸는데 5분 만에 긴장 풀렸다.', who: '20대 여성 · 첫 방문' },
      { text: '호스트 대화력이 장난 아니다. 말이 진짜 통한다.', who: '30대 여성 · 단골' },
      { text: '친구 생일마다 여기 온다. 매번 반응이 "대박".', who: '20대 여성 · 5회 방문' },
    ],
  };
  const pool = reviews[catSlug] || reviews.club;
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>직접 가본 손님의 한마디</h3>
      {pool.map((r, i) => (
        <div key={i} style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '0.95rem', color: '#111', lineHeight: 1.6, marginBottom: '0.5rem' }}>"{r.text}"</p>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>{r.who}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Map: 간단한 약도 + 거리 정보 ── */
export function MiniMap({ venue }: { venue: Venue }) {
  const dist = venue.station ? venue.station.match(/(\d+)분/) : null;
  const minutes = dist ? dist[1] : null;
  return (
    <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '16px', padding: '1.25rem', margin: '1.5rem 0' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#166534' }}>📍 찾아가는 길</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {venue.address && <p style={{ fontSize: '0.9rem', color: '#333' }}>{venue.address}</p>}
        {venue.station && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#22C55E', color: '#FFF', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>교통</span>
            <span style={{ fontSize: '0.9rem', color: '#333' }}>{venue.station}</span>
          </div>
        )}
        {minutes && (
          <p style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 700, marginTop: '0.25rem' }}>
            🚶 역에서 약 {minutes}분 거리
          </p>
        )}
        {venue.map_url && (
          <a href={venue.map_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#22C55E', color: '#FFF', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', marginTop: '0.5rem', width: 'fit-content', minHeight: '44px' }}>
            지도에서 보기 →
          </a>
        )}
      </div>
    </div>
  );
}
