export default function StickyPhoneBar({ name, nickname, phone, label, tel }: { name: string; nickname: string; phone: string; label?: string; tel?: string }) {
  /* 광고 칸(venue-ads.json)이 있는 쪽 — 바 전체가 tel 링크 · 글자 「가게이름 예약 · 닉네임 번호」
     글자가 길어 20px 로는 폰 너비(360~430px)에서 두 줄로 꺾여 44px 바 밖으로 잘린다 →
     이 갈래의 <a> 에만 화면 너비에 맞춘 글자 크기 · 한 줄 고정(다른 광고주 쪽 바는 그대로) */
  if (label) {
    return (
      <div className="phone-bar">
        <a
          href={`tel:${tel || phone}`}
          aria-label={`${nickname}에게 전화`}
          style={{ fontSize: 'clamp(12px, 4.1vw, 20px)', whiteSpace: 'nowrap', lineHeight: 1.2 }}
        >
          {label}
        </a>
      </div>
    );
  }
  return (
    <div className="phone-bar">
      <a href={`tel:${phone}`} target="_blank" rel="noopener noreferrer" aria-label={`${nickname}에게 전화`}>
        📞 {nickname} {phone}
      </a>
    </div>
  );
}
