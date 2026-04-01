export default function StickyPhoneBar({ name, nickname, phone }: { name: string; nickname: string; phone: string }) {
  return (
    <div className="phone-bar">
      <a href={`tel:${phone}`} target="_blank" rel="noopener noreferrer" aria-label={`${nickname}에게 전화`}>
        📞 {nickname} {phone}
      </a>
    </div>
  );
}
