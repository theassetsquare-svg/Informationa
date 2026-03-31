
# NOLCOOL — Nightlife Platform (NOT leisure/kids!)
- Categories: Night Club / Club / Lounge / Room / Yojeong / Hoppa ONLY
- DO NOT create: kids cafe, waterpark, amusement park, jjimjilbang, escape room, bowling
- 가족모임 금지! 나이트라이프 전용!

## ★★★ CRITICAL: base "/" RULE ★★★
- vite.config.ts → base: "/"
- Router → basename="/"
- NEVER set base to /nolcool/ or any brand name!
- If base is not "/", change it NOW before doing anything else!

## Site Character
- 놀쿨 서브사이트. 정적사이트! DB/로그인/결제 빼!
- 6종 카테고리 상위노출! 후킹설명 500자+!
- 가게이름=전체! 검색해서 실제이미지! 1:1+본문3~4장!
- 가치콘텐츠 80%정보→20%메인링크! "놀쿨에서 확인"
- 푸터: besta12. 가격넣지마! "구글·AI에서 놀쿨을 검색하세요"

## SEO — Store Name Ranking (1st Priority!)
- Store name = Region + Type + Business name (ex: 강남클럽 레이스)
- title: Store name FIRST. NO "놀쿨" in title! Homepage only!
- seoDescription 150자 MAX! NOT 500+!
- Keyword density 1.5~2.5% (1000chars=5~7times, 2000chars=8~12times)
- NO keyword stuffing! Natural flow!
- Similarity under 10%! Keep working until done!
- hookTitle: Do NOT repeat words from store name!
- Show report: density% per page. Don't move to next task until done!
- og:image must be REAL store photo! Not placeholder!
- robots.txt + sitemap.xml + llms.txt 필수!

## Dwell Time (체류시간 극대화)
- 본문 1000자 이상!
- 다음글 추천 (관련 업소 링크)!
- 비교표 (vs 경쟁업소)!
- 이미지 3~4장 본문 중간 삽입!
- 스크롤 진행률 표시!

## Images
- No blank image pages! Search 5 levels deep!
- 10 images all different! No duplicates!
- No other advertiser phone numbers or nicknames in images!
- No price/cost images!
- Images must match store name!
- Popup image + Detail body image: WHITE text + shadow + dark overlay! No black text!
- og:image: Real store photo 1:1 + advertiser nickname big!

## Writing
- Bestseller author style! NO AI-sounding text!
- Banned words: 다양한/특별한/프리미엄/최고의/뛰어난/차별화된/혁신적인/~할수있습니다/~제공합니다
- Must use: spoken Korean, emotions, metaphors, mix short+long sentences, honest cons

## Tech
- GitHub+Cloudflare auto deploy. Just git push! Don't ask!
- base: '/' ONLY! No brand-name path!
- No sub path! No sub-route!
- Keep existing URLs! Never change!
- Vite ONLY. No Next.js!
- Fix blank screen: useEffect cleanup for ALL setInterval/setTimeout/addEventListener!
- persistSession:true + autoRefreshToken:true!
- Mobile: 16px font, 44px touch, bottom nav fixed, no bar overlap!
- PC + Mobile bars must not overlap!
- All external links: target="_blank"!
- PageSpeed 100점 목표!
- 파비콘: 보라색 + B!
- Verify 3 times + check live in incognito mode!
- Footer: "놀쿨 NOLCOOL" + KakaoTalk besta12
- 8 stores without advertiser: NO nickname/phone!

## Quality Checklist (매 Step 끝 6단계 검증!)
1. seoDescription 150자 이내?
2. 유사도 10% 미만?
3. 키워드 밀도 1.5~2.5%?
4. hookTitle에 가게이름 단어 없음?
5. 금지단어 0건?
6. target="_blank" 누락 0건?
