'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>
        잠시 문제가 생겼어요
      </h1>
      <p style={{ color: '#333', lineHeight: 1.8, marginBottom: '1.5rem' }}>
        페이지를 불러오는 중 오류가 발생했습니다.<br />
        잠시 후 다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        style={{
          background: '#8B5CF6',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
