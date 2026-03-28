#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OG_DIR = path.join(__dirname, '..', 'public', 'og');
const BODY_DIR = path.join(OG_DIR, 'body');
const GALLERY_DIR = path.join(OG_DIR, 'gallery');
const STOCK_DIR = path.join(__dirname, '..', 'public', 'images', 'stock');
const VENUES_PATH = path.join(__dirname, '..', 'src', 'data', 'venues.json');

const catColors = {
  club: '#4F46E5', night: '#EC4899', lounge: '#06B6D4',
  room: '#3B82F6', yojeong: '#059669', hoppa: '#F43F5E',
};
const catLabels = {
  club: '클럽', night: '나이트', lounge: '라운지',
  room: '룸', yojeong: '요정', hoppa: '호빠',
};
const catPlurals = {
  club: 'clubs', night: 'nights', lounge: 'lounges',
  room: 'rooms', yojeong: 'yojeongs', hoppa: 'hoppas',
};

/* djb2 해시 */
function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* 카테고리별 스톡 이미지 목록 */
function getStockImages(cat) {
  const dir = path.join(STOCK_DIR, cat);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort().map(f => path.join(dir, f));
}

/* 해시 기반으로 스톡 이미지 선택 (업소마다 다른 이미지) */
function pickStock(cat, slug, offset = 0) {
  const imgs = getStockImages(cat);
  if (imgs.length === 0) return null;
  return imgs[(hash(slug + ':img:' + offset)) % imgs.length];
}

/* 텍스트 오버레이 SVG (반투명 배경 위에 텍스트) */
function makeOverlaySvg({ w, h, title, subtitle, nickLine, fontSize, accentColor }) {
  const nick = nickLine
    ? `<text x="${w / 2}" y="${h * 0.6}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${Math.round(fontSize * 0.45)}" font-weight="700" fill="#FCD34D">${escapeXml(nickLine)}</text>`
    : '';
  const badge = accentColor
    ? `<rect x="${w / 2 - 40}" y="${h * 0.28}" width="80" height="6" rx="3" fill="${accentColor}" opacity="0.9"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.15"/>
      <stop offset="40%" stop-color="#000" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#000" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#overlay)"/>
  ${badge}
  <text x="${w / 2}" y="${h * 0.45}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="800" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${escapeXml(title)}</text>
  <text x="${w / 2}" y="${h * 0.53}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${Math.round(fontSize * 0.5)}" fill="white" opacity="0.9">${escapeXml(subtitle)}</text>
  ${nick}
  <text x="${w / 2}" y="${h * 0.92}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${Math.round(fontSize * 0.35)}" fill="white" opacity="0.5">informationa.pages.dev</text>
</svg>`;
}

/* 본문 이미지용 가벼운 오버레이 */
function makeBodyOverlaySvg({ w, h, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="70%" stop-color="#000" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bo)"/>
  <text x="40" y="${h - 24}" font-family="Arial,Helvetica,sans-serif" font-size="24" fill="white" opacity="0.7">${escapeXml(label)}</text>
</svg>`;
}

/* 실제 사진 + 텍스트 오버레이 합성 (1:1 OG용) */
async function genPhotoOg(filepath, stockPath, opts) {
  const { title, subtitle, nickLine, fontSize, accentColor } = opts;
  const W = 1200, H = 1200;

  const base = await sharp(stockPath)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .toBuffer();

  const overlaySvg = makeOverlaySvg({ w: W, h: H, title, subtitle, nickLine, fontSize, accentColor });

  await sharp(base)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .png({ quality: 85 })
    .toFile(filepath);
}

/* 실제 사진 본문/갤러리 이미지 (16:9-ish) */
async function genPhotoBody(filepath, stockPath, label) {
  const W = 1200, H = 800;

  const base = await sharp(stockPath)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .toBuffer();

  const overlaySvg = makeBodyOverlaySvg({ w: W, h: H, label });

  await sharp(base)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .png({ quality: 85 })
    .toFile(filepath);
}

/* 폴백: 스톡 없을 때 기존 그라데이션 SVG */
function makeFallbackSvg({ bg, bg2, title, subtitle, footer, nickLine, fontSize }) {
  const nick = nickLine ? `<text x="600" y="680" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="36" font-weight="700" fill="#FCD34D">${escapeXml(nickLine)}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${bg}" stop-opacity="0.95"/>
    <stop offset="100%" stop-color="${bg2 || bg}" stop-opacity="0.75"/>
  </linearGradient></defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="1080" rx="40" fill="white" opacity="0.1"/>
  <text x="600" y="480" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize || 80}" font-weight="800" fill="white">${escapeXml(title)}</text>
  <text x="600" y="580" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="40" fill="white" opacity="0.85">${escapeXml(subtitle)}</text>
  ${nick}
  <text x="600" y="1060" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="30" fill="white" opacity="0.5">${escapeXml(footer)}</text>
</svg>`;
}

async function genFallback(filepath, opts) {
  await sharp(Buffer.from(makeFallbackSvg(opts))).resize(1200, 1200).png({ quality: 85 }).toFile(filepath);
}

const bodyLabels = ['내부 분위기', '조명과 인테리어', '바 카운터', '테이블 구역'];
const galleryLabels = ['입구 전경', '무대와 공연', '라운지 공간', '칵테일 바', 'VIP 구역', '플로어 전경'];

(async () => {
  for (const d of [OG_DIR, BODY_DIR, GALLERY_DIR]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  const venues = JSON.parse(fs.readFileSync(VENUES_PATH, 'utf-8'));

  // 1. home OG (실제 사진 합성)
  const homeStock = pickStock('club', 'home-og', 99);
  if (homeStock) {
    await genPhotoOg(path.join(OG_DIR, 'home.png'), homeStock, {
      title: '놀쿨 NOLCOOL', subtitle: '전국 클럽·나이트·라운지·룸·요정·호빠',
      fontSize: 80, accentColor: '#8B5CF6',
    });
  } else {
    await genFallback(path.join(OG_DIR, 'home.png'), { bg: '#8B5CF6', bg2: '#6D28D9', title: '놀쿨 NOLCOOL', subtitle: '전국 클럽·나이트·라운지·룸·요정·호빠', footer: 'informationa.pages.dev' });
  }
  console.log('✓ home.png');

  // 2. 카테고리 페이지 OG
  for (const [cat, label] of Object.entries(catLabels)) {
    const cnt = venues.filter(v => v.cat_slug === cat).length;
    const stock = pickStock(cat, 'category-' + cat, 50);
    if (stock) {
      await genPhotoOg(path.join(OG_DIR, catPlurals[cat] + '.png'), stock, {
        title: `${label} 가이드`, subtitle: `전국 ${cnt}곳 완전 정리`,
        fontSize: 80, accentColor: catColors[cat],
      });
    } else {
      await genFallback(path.join(OG_DIR, catPlurals[cat] + '.png'), { bg: catColors[cat], bg2: catColors[cat], title: `${label} 가이드`, subtitle: `전국 ${cnt}곳 완전 정리`, footer: 'informationa.pages.dev' });
    }
  }
  console.log('✓ 카테고리 6종');

  // 3. 업소별: OG 1장 + 본문 4장 + 갤러리 6장
  for (const v of venues) {
    const nm = v.name;
    const cat = v.cat_slug;
    const fs2 = nm.length > 12 ? 56 : nm.length > 8 ? 68 : nm.length > 5 ? 80 : 96;
    const bg = catColors[cat] || '#4F46E5';
    const nickLine = v.nickname ? `담당 ${v.nickname}` : '';

    // OG 메인 (1:1, 실제 사진)
    const mainStock = pickStock(cat, v.slug, 0);
    if (mainStock) {
      await genPhotoOg(path.join(OG_DIR, `${cat}-${v.slug}.png`), mainStock, {
        title: nm, subtitle: `${v.region} ${catLabels[cat] || ''}`,
        nickLine, fontSize: fs2, accentColor: bg,
      });
    } else {
      await genFallback(path.join(OG_DIR, `${cat}-${v.slug}.png`), {
        bg, bg2: bg, title: nm, subtitle: `${v.region} ${catLabels[cat] || ''}`,
        footer: 'informationa.pages.dev', nickLine, fontSize: fs2,
      });
    }

    // 본문 4장 (각각 다른 스톡 이미지)
    for (let i = 0; i < 4; i++) {
      const bStock = pickStock(cat, v.slug, i + 10);
      if (bStock) {
        await genPhotoBody(path.join(BODY_DIR, `${cat}-${v.slug}-${i + 1}.png`), bStock, bodyLabels[i]);
      } else {
        // 폴백: 기존 그라데이션
        const [c1, c2] = [['#1E1B4B', '#312E81'], ['#042F2E', '#134E4A'], ['#4A1D96', '#6D28D9'], ['#7C2D12', '#9A3412']][i];
        await genFallback(path.join(BODY_DIR, `${cat}-${v.slug}-${i + 1}.png`), {
          bg: c1, bg2: c2, title: nm, subtitle: bodyLabels[i],
          footer: `${v.region} ${catLabels[cat] || ''}`, fontSize: fs2,
        });
      }
    }

    // 갤러리 6장
    for (let i = 0; i < 6; i++) {
      const gStock = pickStock(cat, v.slug, i + 20);
      if (gStock) {
        await genPhotoBody(path.join(GALLERY_DIR, `${cat}-${v.slug}-g${i + 1}.png`), gStock, galleryLabels[i]);
      } else {
        const colors = [['#1E3A5F', '#1E40AF'], ['#4C1D95', '#7C3AED'], ['#064E3B', '#047857'], ['#78350F', '#B45309'], ['#701A75', '#A21CAF'], ['#1F2937', '#374151']];
        const [c1, c2] = colors[i];
        await genFallback(path.join(GALLERY_DIR, `${cat}-${v.slug}-g${i + 1}.png`), {
          bg: c1, bg2: c2, title: nm, subtitle: galleryLabels[i],
          footer: `${v.region} ${catLabels[cat] || ''}`, fontSize: fs2,
        });
      }
    }
  }

  console.log(`✓ 업소 ${venues.length}곳 × 11장 = ${venues.length * 11}장`);
  console.log(`\n총 ${7 + 1 + venues.length * 11}개 이미지 생성 완료 (실제 사진 기반)`);
})();
