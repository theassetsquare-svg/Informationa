
# NOLCOOL — Nightlife Platform (NOT leisure/kids!)
- Categories: Night Club / Club / Lounge / Room / Yojeong / Hoppa ONLY
- DO NOT create: kids cafe, waterpark, amusement park, jjimjilbang, escape room, bowling
- 가족모임 금지! 나이트라이프 전용!

## ★★★ CRITICAL: base "/" RULE ★★★
- vite.config.ts → base: "/"
- Router → basename="/"
- NEVER set base to /nolcool/ or any brand name!
- If base is not "/", change it NOW before doing anything else!

## ★★★ seoDescription ≠ 본문! 헷갈리면 FAIL! ★★★
- seoDescription = 150자 이내! 후킹 메타설명!
- 본문 = 1000자 이상! 상세 콘텐츠!
- seoDescription 150자 넘으면 다음작업 절대 금지!
- 500자 이상 있으면 즉시 150자로 축소!

## Site Character
- 놀쿨 서브사이트. 정적사이트! DB/로그인/결제 빼!
- 6종 카테고리 상위노출! 후킹설명 500자+!
- 가게이름=전체! 검색해서 실제이미지! 1:1+본문3~4장!
- 가치콘텐츠 80%정보→20%메인링크! "놀쿨에서 확인"
- 푸터: besta12. 가격넣지마! "구글·AI에서 놀쿨을 검색하세요"

## SEO — Store Name Ranking (1st Priority!)
- Store name = Region + Type + Business name (ex: 강남클럽 레이스)
- title: Store name FIRST. NO "놀쿨" in title! Homepage only!
- title에 같은 단어 2번 나오면 즉시 삭제! ("대전봉명나이트 — 대전에서" = 대전2번 = FAIL!)
- seoDescription 150자 MAX! NOT 500+!
- Keyword density 1.5~2.5% (1000chars=5~7times, 2000chars=8~12times)
- NO keyword stuffing! 키워드스터핑 전부 삭제!
- Similarity under 10%! 10% 이하 안 되면 절대 멈추지 마!
- hookTitle: Do NOT repeat words from store name! 가게이름/지역명 단어 넣지마!
- 빌드시 제목 중복단어 검사! 같은단어 있으면 빌드실패!
- Show report: 유사도% 표 + 키워드밀도% 표! Don't move to next task until done!
- og:title에 가게이름 전체 포함!
- og:image must be REAL store photo! Not placeholder!
- robots.txt + sitemap.xml + llms.txt 필수!
- 본문 첫 100자에 가게이름(지역+종류+상호명) 1번!
- JSON-LD NightClub 스키마 모든 상세페이지! (가게이름/위치/특징)

## Dwell Time (체류 95분 — 틱톡/넷플릭스/슬롯머신 심리학!)
- 본문 1000자 이상!
- 자동재생 다음콘텐츠! 멈출 수 없게!
- 무한스크롤! 끝이 없게!
- 가변보상! 스크롤할 때마다 다른 콘텐츠!
- 스와이프 갤러리! 넘기고 싶게!
- VS투표/퀴즈/운세! 참여하고 싶게!
- "이 업소의 비밀" 스크롤 80%에!
- 카운터 "오늘 N명이 봤습니다"!
- 다음글 추천 (관련 업소 링크)!
- 비교표 (vs 경쟁업소)!
- 이미지 3~4장 본문 중간 삽입!
- 스크롤 진행률 표시!
- 완벽할 때까지 작업! 보고서로 보여줘!

## Images
- 본문 4장 + 갤러리 6장 = 10장 전부 다른 이미지! 중복=FAIL!
- 사진갤러리 6장 필수! 못찾으면 5단계까지 검색! 빈갤러리=FAIL!
- No other advertiser phone numbers or nicknames in images!
- No price/cost images!
- Images must match store name!
- Popup image + Detail body image: WHITE text + shadow + dark overlay! No black text!
- og:image: Real store photo 1:1 + advertiser nickname big overlay!
- 해운대고구려: 신실장 닉네임 넣지마!

## Writing (베스트셀러 작가 글!)
- AI느낌 나면 전부 다시 작성! 될 때까지!
- Banned: 다양한/특별한/프리미엄/최고의/뛰어난/차별화된/혁신적인/~할수있습니다/~제공합니다
- Must use: 구어체/감정/비유/짧은+긴문장/솔직한단점/독자에게말걸기
- 모든 페이지 후킹 제목!

## Tech
- GitHub+Cloudflare auto deploy. Just git push! Don't ask! Purge Everything!
- base: '/' ONLY! No brand-name path!
- No sub path! No sub-route!
- Keep existing URLs! Never change!
- Vite ONLY. No Next.js!
- Fix blank screen: useEffect cleanup for ALL setInterval/setTimeout/addEventListener!
- persistSession:true + autoRefreshToken:true!
- Mobile: 16px font, line-height 1.6, 44px touch, bottom nav fixed, 무한스크롤, 스와이프갤러리!
- PC + Mobile bars must not overlap!
- All external links: target="_blank"!
- PageSpeed 100점 목표!
- 파비콘: 보라색 + B!
- Verify 3 times + check live in incognito mode!
- Footer: "놀쿨 NOLCOOL" + KakaoTalk besta12

## Advertiser Rules
- 광고주 없는 8업소 (닉네임/전화 금지!):
  상봉동한국관 / 화정한국관 / 수원코리아 / 분당퐁퐁 / 부산아시아드 / 울산뉴월드 / 수유샴푸 / 인덕원국빈관
- 해운대고구려: 신실장 닉네임 넣지마!

## Quality Checklist (매 Step 끝 6단계 검증!)
1. seoDescription 150자 이내? (본문과 혼동 금지!)
2. 유사도 10% 미만? (안 되면 계속 작업!)
3. 키워드 밀도 1.5~2.5%? (스터핑 0건?)
4. hookTitle에 가게이름 단어 없음? title 중복단어 없음?
5. 금지단어 0건? AI느낌 0건?
6. target="_blank" 누락 0건?

## Completion Order
1. 위 설정 전부 완벽하게!
2. 보고서 보여줘! (유사도% 표 + 키워드밀도% 표)
3. git push!
4. 라이브사이트 확인!
5. 메인사이트 주소 줘!
