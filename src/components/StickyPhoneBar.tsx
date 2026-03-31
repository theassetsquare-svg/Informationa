export default function StickyPhoneBar({ name, nickname, phone }: { name: string; nickname: string; phone: string }) {
  return (
    <>
      <div className="sticky-phone-bar">
        <a
          href={`tel:${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${nickname}에게 전화`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: '#15803D', color: '#FFFFFF',
            padding: '1rem 1.5rem', borderRadius: '12px',
            fontWeight: 700, fontSize: '1rem',
            textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            minHeight: '52px',
          }}
        >
          📞 {nickname}에게 전화 {phone}
        </a>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .sticky-phone-bar {
          position: fixed; bottom: 72px; left: 50%; transform: translateX(-50%);
          width: calc(100% - 32px); max-width: 400px; z-index: 45;
        }
        @media (min-width: 768px) {
          .sticky-phone-bar { bottom: 24px; right: 24px; left: auto; transform: none; width: auto; }
        }
      `}} />
    </>
  );
}
