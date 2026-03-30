'use client';

import { Venue } from '@/lib/venues';
import { getVenueImage } from '@/lib/venue-images';
import { useState } from 'react';

const catWords: Record<string, string[]> = {
  club: ['클럽'], night: ['나이트'], lounge: ['라운지'],
  room: ['룸'], yojeong: ['요정'], hoppa: ['호빠'],
};

const catColors: Record<string, string> = {
  club: '#4F46E5', night: '#EC4899', lounge: '#06B6D4',
  room: '#3B82F6', yojeong: '#059669', hoppa: '#F43F5E',
};

function shouldShowMeta(venue: Venue): string | null {
  const name = venue.name;
  const regionInName = name.includes(venue.region) || name.includes(venue.district);
  const catInName = (catWords[venue.cat_slug] || []).some(w => name.includes(w));
  if (regionInName && catInName) return null;
  if (catInName && !regionInName) return venue.region;
  if (regionInName && !catInName) {
    const labels: Record<string, string> = { club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' };
    return labels[venue.cat_slug] || venue.cat_slug;
  }
  const labels: Record<string, string> = { club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' };
  return `${venue.region} · ${labels[venue.cat_slug]}`;
}

export default function VenueCard({ venue }: { venue: Venue }) {
  const [imgErr, setImgErr] = useState(false);
  const meta = shouldShowMeta(venue);
  const bg = catColors[venue.cat_slug] || '#4F46E5';
  const thumbSrc = getVenueImage(venue.cat_slug, venue.slug);
  const nameParts = venue.name.split(' ');
  const line1 = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : venue.name;
  const line2 = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <a
      href={`/${venue.cat_slug}/${venue.slug}/`}
      target="_blank" rel="noopener noreferrer"
      className="venue-card"
      style={{ textDecoration: 'none', color: 'inherit', flexDirection: 'row' }}
    >
      {/* 1:1 썸네일 — 실제 이미지 or 카테고리 컬러 fallback */}
      <div style={{
        width: '100px', minWidth: '100px', height: '100px',
        background: bg, borderRadius: '16px 0 0 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0.5rem', overflow: 'hidden', position: 'relative',
      }}>
        {!imgErr ? (
          <img
            src={thumbSrc}
            alt={venue.image_alt || venue.name}
            width={100}
            height={100}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: '16px 0 0 16px' }}
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <>
            <span style={{ color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', lineHeight: 1.3, wordBreak: 'keep-all' as const, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {line1}
            </span>
            {line2 && (
              <span style={{ color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', marginTop: '2px', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                {line2}
              </span>
            )}
          </>
        )}
      </div>

      <div className="venue-card-body">
        {venue.badge && <span className="venue-card-badge">{venue.badge}</span>}
        {meta && <span className="venue-card-meta">{meta}</span>}
        <h3>{venue.name}</h3>
        <p className="venue-card-hook">{venue.card_hook}</p>
      </div>
    </a>
  );
}
