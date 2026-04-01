#!/usr/bin/env node
/**
 * SEO Similarity & Keyword Stuffing Analyzer
 * Analyzes all HTML pages in dist/ for content similarity and keyword stuffing
 */

const fs = require('fs');
const path = require('path');

// ── Extract text content from HTML ──
function extractText(html) {
  // Remove scripts, styles, SVGs
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

// ── Extract meta description ──
function extractMeta(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
    || html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
  };
}

// ── Trigram similarity (more accurate than word-level Jaccard) ──
function trigrams(text) {
  const t = text.toLowerCase().replace(/\s+/g, ' ');
  const set = new Set();
  for (let i = 0; i < t.length - 2; i++) {
    set.add(t.substring(i, i + 3));
  }
  return set;
}

function jaccardSimilarity(setA, setB) {
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ── Keyword stuffing detection ──
function detectKeywordStuffing(text) {
  const words = text.toLowerCase().replace(/[^\uAC00-\uD7A3a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 2);
  const total = words.length;
  if (total < 50) return [];

  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const stuffed = [];
  for (const [word, count] of Object.entries(freq)) {
    const density = (count / total) * 100;
    // Keyword stuffing: same word > 3% density AND appears > 5 times
    if (density > 3 && count > 5) {
      stuffed.push({ word, count, density: density.toFixed(2) + '%' });
    }
  }
  return stuffed.sort((a, b) => parseFloat(b.density) - parseFloat(a.density));
}

// ── Find all HTML index files ──
function findHtmlFiles(dir) {
  const results = [];
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        // Skip _next and static directories
        if (e.name === '_next' || e.name === 'static' || e.name === 'og') continue;
        walk(full);
      } else if (e.name === 'index.html') {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

// ── Main ──
const distDir = path.join(__dirname, 'dist');
const files = findHtmlFiles(distDir);

console.log(`\n${'='.repeat(80)}`);
console.log(`  SEO 유사도 & 키워드 스터핑 분석 보고서`);
console.log(`  분석 일시: ${new Date().toLocaleString('ko-KR')}`);
console.log(`  분석 페이지 수: ${files.length}`);
console.log(`${'='.repeat(80)}\n`);

// Parse all pages
const pages = [];
for (const file of files) {
  const rel = path.relative(distDir, path.dirname(file));
  const html = fs.readFileSync(file, 'utf-8');
  const meta = extractMeta(html);
  const text = extractText(html);
  const bodyTrigrams = trigrams(text);
  const descTrigrams = trigrams(meta.description);
  const stuffing = detectKeywordStuffing(text);

  pages.push({
    path: '/' + (rel || 'index') + '/',
    title: meta.title,
    description: meta.description,
    text,
    bodyTrigrams,
    descTrigrams,
    stuffing,
    wordCount: text.split(/\s+/).length,
  });
}

// ── 1. Meta Description Similarity ──
console.log(`\n${'─'.repeat(80)}`);
console.log(`  1. 메타 설명(Description) 유사도 분석`);
console.log(`${'─'.repeat(80)}\n`);

const descPairs = [];
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    if (!pages[i].description || !pages[j].description) continue;
    const sim = jaccardSimilarity(pages[i].descTrigrams, pages[j].descTrigrams);
    if (sim > 0.1) { // 10% threshold
      descPairs.push({
        pageA: pages[i].path,
        pageB: pages[j].path,
        similarity: (sim * 100).toFixed(1),
        descA: pages[i].description.slice(0, 80),
        descB: pages[j].description.slice(0, 80),
      });
    }
  }
}

descPairs.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));

if (descPairs.length === 0) {
  console.log('  ✅ 10% 이상 유사한 메타 설명 없음\n');
} else {
  console.log(`  ⚠️  10% 이상 유사한 메타 설명 쌍: ${descPairs.length}개\n`);
  for (const p of descPairs.slice(0, 30)) {
    console.log(`  [${p.similarity}%] ${p.pageA} ↔ ${p.pageB}`);
    console.log(`    A: ${p.descA}...`);
    console.log(`    B: ${p.descB}...`);
    console.log();
  }
}

// ── 2. Body Content Similarity ──
console.log(`\n${'─'.repeat(80)}`);
console.log(`  2. 본문 콘텐츠 유사도 분석`);
console.log(`${'─'.repeat(80)}\n`);

const bodyPairs = [];
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const sim = jaccardSimilarity(pages[i].bodyTrigrams, pages[j].bodyTrigrams);
    if (sim > 0.10) {
      bodyPairs.push({
        pageA: pages[i].path,
        pageB: pages[j].path,
        similarity: (sim * 100).toFixed(1),
      });
    }
  }
}

bodyPairs.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));

if (bodyPairs.length === 0) {
  console.log('  ✅ 10% 이상 유사한 본문 콘텐츠 없음\n');
} else {
  console.log(`  ⚠️  10% 이상 유사한 본문 콘텐츠 쌍: ${bodyPairs.length}개\n`);
  for (const p of bodyPairs.slice(0, 50)) {
    console.log(`  [${p.similarity}%] ${p.pageA} ↔ ${p.pageB}`);
  }
}

// ── 3. Title Similarity ──
console.log(`\n${'─'.repeat(80)}`);
console.log(`  3. 페이지 타이틀 유사도 분석`);
console.log(`${'─'.repeat(80)}\n`);

const titlePairs = [];
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    if (!pages[i].title || !pages[j].title) continue;
    const simT = jaccardSimilarity(trigrams(pages[i].title), trigrams(pages[j].title));
    if (simT > 0.3) {
      titlePairs.push({
        pageA: pages[i].path,
        pageB: pages[j].path,
        similarity: (simT * 100).toFixed(1),
        titleA: pages[i].title,
        titleB: pages[j].title,
      });
    }
  }
}

titlePairs.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));

if (titlePairs.length === 0) {
  console.log('  ✅ 30% 이상 유사한 타이틀 없음\n');
} else {
  console.log(`  ⚠️  30% 이상 유사한 타이틀 쌍: ${titlePairs.length}개\n`);
  for (const p of titlePairs.slice(0, 30)) {
    console.log(`  [${p.similarity}%] ${p.pageA} ↔ ${p.pageB}`);
    console.log(`    A: ${p.titleA}`);
    console.log(`    B: ${p.titleB}`);
    console.log();
  }
}

// ── 4. Keyword Stuffing ──
console.log(`\n${'─'.repeat(80)}`);
console.log(`  4. 키워드 스터핑 감지`);
console.log(`${'─'.repeat(80)}\n`);

let stuffingCount = 0;
for (const page of pages) {
  if (page.stuffing.length > 0) {
    stuffingCount++;
    console.log(`  ⚠️  ${page.path} (총 단어: ${page.wordCount})`);
    for (const s of page.stuffing) {
      console.log(`    - "${s.word}" : ${s.count}회 (밀도 ${s.density})`);
    }
    console.log();
  }
}

if (stuffingCount === 0) {
  console.log('  ✅ 키워드 스터핑 감지 안됨\n');
}

// ── 5. Overall Summary ──
console.log(`\n${'='.repeat(80)}`);
console.log(`  종합 요약`);
console.log(`${'='.repeat(80)}\n`);

// Calculate average similarity per page
const avgSim = {};
for (const p of bodyPairs) {
  avgSim[p.pageA] = avgSim[p.pageA] || [];
  avgSim[p.pageA].push(parseFloat(p.similarity));
  avgSim[p.pageB] = avgSim[p.pageB] || [];
  avgSim[p.pageB].push(parseFloat(p.similarity));
}

const pageStats = Object.entries(avgSim)
  .map(([pg, sims]) => ({
    page: pg,
    avgSim: (sims.reduce((a, b) => a + b, 0) / sims.length).toFixed(1),
    maxSim: Math.max(...sims).toFixed(1),
    pairCount: sims.length,
  }))
  .sort((a, b) => parseFloat(b.maxSim) - parseFloat(a.maxSim));

console.log(`  총 분석 페이지: ${pages.length}`);
console.log(`  메타설명 유사 쌍(>10%): ${descPairs.length}`);
console.log(`  본문 유사 쌍(>10%): ${bodyPairs.length}`);
console.log(`  타이틀 유사 쌍(>30%): ${titlePairs.length}`);
console.log(`  키워드 스터핑 페이지: ${stuffingCount}`);
console.log();

if (pageStats.length > 0) {
  console.log(`  ── 유사도 최고 페이지 TOP 20 ──\n`);
  for (const ps of pageStats.slice(0, 20)) {
    console.log(`  ${ps.page}`);
    console.log(`    최대 유사도: ${ps.maxSim}% | 평균: ${ps.avgSim}% | 유사 페이지 수: ${ps.pairCount}`);
  }
}

// ── 6. All pages description list ──
console.log(`\n${'─'.repeat(80)}`);
console.log(`  6. 전체 페이지 메타설명 목록`);
console.log(`${'─'.repeat(80)}\n`);

for (const page of pages.sort((a, b) => a.path.localeCompare(b.path))) {
  console.log(`  ${page.path}`);
  console.log(`    제목: ${page.title}`);
  console.log(`    설명: ${page.description}`);
  console.log();
}
