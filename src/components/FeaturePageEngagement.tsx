'use client';

/* ═══════════════════════════════════════════════════════════
   피처 페이지 엔게이지먼트 스위트
   quiz, roulette, vs, ranking, map, gallery, magazine 등
   체류시간 극대화 시스템 — 경량 venue 데이터만 사용
   ═══════════════════════════════════════════════════════════ */

import { useMemo } from 'react';
import {
  SlotMachine, DailyStreak, EndlessRecommend, MoodMatch,
  WeeklyHot, BingeChain, VenueQuizGame, LiveActivityFeed,
  ExploreProgress, TikTokFeed, AutoPlayCountdown, DailyFortune,
  StoryMode, JackpotHunt,
} from './AddictionEngine';
import { AIRecommendHook, FullCompareHook } from './HookingCTAs';

/* 경량 venue 타입: SSR 직렬화 크기 최소화 */
interface LightVenue {
  name: string; slug: string; cat_slug: string; category: string;
  region: string; card_hook: string; nickname?: string;
}

function slim(venues: any[]): LightVenue[] {
  return venues.slice(0, 20).map(v => ({
    name: v.name, slug: v.slug, cat_slug: v.cat_slug, category: v.category,
    region: v.region, card_hook: v.card_hook, nickname: v.nickname || undefined,
  }));
}

export default function FeaturePageEngagement({ venues }: { venues: any[] }) {
  const v = useMemo(() => slim(venues), [venues]);

  return (
    <>
      <section className="section">
        <div className="container"><AIRecommendHook /></div>
      </section>

      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container"><MoodMatch venues={v} /></div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>한 곳씩 발견하기</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1rem', fontSize: '0.85rem' }}>
            다음 추천을 눌러 새로운 곳을 발견하자
          </p>
          <TikTokFeed venues={v} />
        </div>
      </section>

      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container"><SlotMachine venues={v.slice(0, 7)} /></div>
      </section>

      <section className="section">
        <div className="container"><BingeChain venues={v} /></div>
      </section>

      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container"><WeeklyHot venues={v} /></div>
      </section>

      <section className="section">
        <div className="container"><VenueQuizGame venues={v} /></div>
      </section>

      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container"><DailyFortune venues={v} /></div>
      </section>

      <section className="section">
        <div className="container narrow"><DailyStreak /></div>
      </section>

      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>스토리로 보기</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1rem', fontSize: '0.85rem' }}>자동으로 넘어가는 스토리</p>
          <StoryMode venues={v} />
        </div>
      </section>

      <section className="section">
        <div className="container"><JackpotHunt venues={v} /></div>
      </section>

      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container"><AutoPlayCountdown venues={v} /></div>
      </section>

      <section className="section">
        <div className="container"><LiveActivityFeed /></div>
      </section>

      <section className="section" style={{ background: '#F7F7F8' }}>
        <div className="container narrow"><EndlessRecommend venues={v.slice(0, 10)} /></div>
      </section>

      <section style={{ padding: '1rem 0' }}>
        <div className="container narrow"><ExploreProgress /></div>
      </section>

      <section style={{ padding: '1rem 0' }}>
        <div className="container"><FullCompareHook /></div>
      </section>
    </>
  );
}
