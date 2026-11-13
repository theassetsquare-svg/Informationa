// 가게 전용 사이트(hh) — 빌드 맨 끝 단계. 대표님 지시 2026-09-27 「홈화면은 나이트 내용 0 · 건전한 정보」.
//   ① dedicated/home.html(건전 홈 · 정적) → dist/index.html  (Next 가 만든 옛 홈을 덮는다)
//   ② public/ 의 가게 쪽·통로 쪽 주소를 dist/sitemap.xml 에 더한다(이미 있으면 건너뜀)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
const HOST = 'https://hh.nolcool.com';
const 쪽들 = readdirSync('public', { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^(suwon-chancedome-night(-\d+)?|gwonseon-map-notes)$/.test(e.name) && existsSync(`public/${e.name}/index.html`))
  .map((e) => e.name).sort();
writeFileSync('dist/index.html', readFileSync('dedicated/home.html', 'utf8'));
let 더함 = 0;
if (existsSync('dist/sitemap.xml')) {
  let sm = readFileSync('dist/sitemap.xml', 'utf8');
  const 오늘 = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  for (const d of 쪽들) {
    const loc = `${HOST}/${d}/`;
    if (sm.includes(`<loc>${loc}</loc>`)) continue;
    sm = sm.replace('</urlset>', `<url><loc>${loc}</loc><lastmod>${오늘}</lastmod></url>\n</urlset>`); 더함++;
  }
  // ③ 일산76-2 지적 고침(2026-11-13): strict 광고주 쪽(src/data/venue-ads.json)의 <url> 에 새 카드 그림 줄 — 다른 쪽은 그대로
  {
    const 광고 = JSON.parse(readFileSync('src/data/venue-ads.json', 'utf8'));
    const 가게 = JSON.parse(readFileSync('src/data/venues.json', 'utf8'));
    let 그림 = 0;
    for (const [slug, a] of Object.entries(광고)) {
      if (!a.strict || !a.card) continue;
      const v = 가게.find((x) => x.slug === slug); if (!v) continue;
      const loc = `<loc>${HOST}/${v.cat_slug}/${slug}/</loc>`;
      const i = sm.indexOf(loc); if (i < 0) continue;
      const j = sm.indexOf('</url>', i);
      if (sm.slice(i, j).includes('<image:image>')) continue;
      sm = sm.slice(0, j) + `<image:image>\n<image:loc>${HOST}${a.card}</image:loc>\n</image:image>\n` + sm.slice(j); 그림++;
    }
    if (그림 && !sm.includes('xmlns:image=')) sm = sm.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    console.log(`[dedicated-home] 사이트맵 그림 줄 +${그림}`);
  }
  writeFileSync('dist/sitemap.xml', sm);
}
console.log(`[dedicated-home] 홈 교체 · 사이트맵 +${더함} (쪽 ${쪽들.length})`);
