# NOLCOOL Sub — Single Store Nightlife Site
## MUST
- base: "/" ONLY. BrowserRouter ONLY. No # in URL
- Store name FIRST in title. No "놀쿨" in title!
- Keyword density 1.5-2.5% (1000c=5-7x, 2000c=8-12x)
- Mobile: 16px font, 1.7 line-height, 44px touch
- useEffect cleanup ALL. persistSession:true. ErrorBoundary
- Bestseller writing. No AI text.
- All links open in new tab! target="_blank" rel="noopener noreferrer" Internal search ONLY

★★★ TITLE RULES — NO DUPLICATE WORDS! ★★★
Homepage ONLY: "놀쿨 — hook title"
ALL other pages: Store name + hook. NO 놀쿨! NO same word twice!
WRONG: "장안동호빠 장안동호빠" → DELETE duplicate!
WRONG: "강남클럽 레이스 강남 최고" → "강남" twice → DELETE!
RIGHT: "강남클럽 레이스 — 한번 가면 단골 되는 이유"
RIGHT: "장안동호빠 — 직접 가본 사람만 아는 진짜 이야기"
meta description: 150 chars. Store name + hooking. NO duplicate words!
Check EVERY page title. Same word appears twice = DELETE immediately!
Do NOT ask. Just fix. Report all titles when done.
- react-helmet-async for unique title/meta per page! SPA bots fix!
## SEO 2026
- title: Store name + hook. Under 60 chars
- meta: 150 chars. H1+H2 with store name 3+ times
- Schema: JSON-LD NightClub. og:image: real photo + nickname
- sitemap.xml + robots.txt + llms.txt
- Core Web Vitals: LCP<2.5s, INP<200ms, CLS<0.1
- E-E-A-T: real experience tone. Canonical URL. NEVER duplicate title/content across domains!. og:image 1200x1200 (1:1) every page!

★★★★★ CRITICAL: CROSS-DOMAIN DUPLICATE = SEO DEATH! ★★★★★
Same prompt on different domains = same title = Google DUPLICATE PENALTY!
Every site, every page = COMPLETELY UNIQUE title + content!
Similarity between ANY two sites must be under 10%!

[How to make unique]
1. Title: NEVER copy from other sites! Create NEW title every time!
   - Same store, different domain → different hook, different angle
   - Site A: "일산명월관요정 — 30년 전통의 진짜 이야기"
   - Site B: "일산명월관요정 — 직접 가본 사람만 아는 것들"
   - Site C: "일산명월관요정 — 예약 전에 꼭 읽어야 할 글"
   → 3개 전부 다른 제목!
2. Content: Same topic, different perspective!
   - Site A: "분위기 중심" 글 / Site B: "음식 중심" 글 / Site C: "예약/가격 가이드" 글
   → 같은 가게여도 글 내용이 완전히 다름!
3. meta description: 전부 다르게!
4. H2 소제목: 전부 다르게!
5. Body text: 같은 문장 1개도 겹치면 안 됨!

[Check before writing]
grep -rn "title" src/ — If ANY title matches another site = CHANGE immediately!
Google duplicate content = ALL sites drop ranking = 0 traffic = disaster!
Do NOT reuse any title, description, or body text from other sites!
Every single word must be freshly written!
Do NOT ask. Just make it unique. Report all titles when done.

## NEVER
- Auto page transition. Next.js. Change URLs
- Brand path. Stuffing. Baby/family/kids images. No family content (parents birthday/family gathering/reunion/anniversary = DELETE!). Banned adult words (adult/prostitution/illegal = DELETE ALL!). Adult words
