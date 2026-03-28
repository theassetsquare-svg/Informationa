#!/usr/bin/env node
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const STOCK_DIR = path.join(__dirname, '..', 'public', 'images', 'stock');

const IMAGES = {
  club: [
    'https://images.pexels.com/photos/15995095/pexels-photo-15995095.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5156606/pexels-photo-5156606.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/18704225/pexels-photo-18704225.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5143166/pexels-photo-5143166.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3808102/pexels-photo-3808102.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1514190226263-0a4456a291f2?w=1200&q=80',
    'https://images.unsplash.com/photo-1572327918628-bf61496743ce?w=1200&q=80',
    'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=1200&q=80',
    'https://images.unsplash.com/photo-1618609377864-68609b857e90?w=1200&q=80',
    'https://images.unsplash.com/photo-1562189447-b5b4c783a8b9?w=1200&q=80',
    'https://images.pexels.com/photos/34784358/pexels-photo-34784358.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/35287290/pexels-photo-35287290.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/33588956/pexels-photo-33588956.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/31923251/pexels-photo-31923251.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1506485927884-1900e37ac5ed?w=1200&q=80',
  ],
  night: [
    'https://images.pexels.com/photos/1677710/pexels-photo-1677710.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/342520/pexels-photo-342520.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3249760/pexels-photo-3249760.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1449795/pexels-photo-1449795.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/270866/pexels-photo-270866.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1765712/pexels-photo-1765712.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/167605/pexels-photo-167605.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/17606660/pexels-photo-17606660.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/34784358/pexels-photo-34784358.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/15995095/pexels-photo-15995095.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5156606/pexels-photo-5156606.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3808102/pexels-photo-3808102.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/33588956/pexels-photo-33588956.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  lounge: [
    'https://images.pexels.com/photos/29850671/pexels-photo-29850671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/19689233/pexels-photo-19689233.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/4762719/pexels-photo-4762719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/20104020/pexels-photo-20104020.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/7135958/pexels-photo-7135958.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/17010905/pexels-photo-17010905.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/9566350/pexels-photo-9566350.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/6065197/pexels-photo-6065197.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/4485382/pexels-photo-4485382.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/16807989/pexels-photo-16807989.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/11538297/pexels-photo-11538297.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3811834/pexels-photo-3811834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/10331388/pexels-photo-10331388.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  room: [
    'https://images.pexels.com/photos/18433817/pexels-photo-18433817.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/16100487/pexels-photo-16100487.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/13717323/pexels-photo-13717323.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/8885024/pexels-photo-8885024.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/6860821/pexels-photo-6860821.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/19569865/pexels-photo-19569865.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3534750/pexels-photo-3534750.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/6908500/pexels-photo-6908500.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  hoppa: [
    'https://images.pexels.com/photos/3745525/pexels-photo-3745525.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/29850671/pexels-photo-29850671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/20104020/pexels-photo-20104020.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/4485382/pexels-photo-4485382.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3811834/pexels-photo-3811834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/19689233/pexels-photo-19689233.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/33588956/pexels-photo-33588956.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  yojeong: [
    'https://images.pexels.com/photos/31990882/pexels-photo-31990882.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/31663811/pexels-photo-31663811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/31735995/pexels-photo-31735995.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/33795173/pexels-photo-33795173.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/34416812/pexels-photo-34416812.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/6896969/pexels-photo-6896969.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/34665085/pexels-photo-34665085.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5774152/pexels-photo-5774152.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/8999080/pexels-photo-8999080.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/36182554/pexels-photo-36182554.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
};

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const ws = fs.createWriteStream(filepath);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(filepath); });
      ws.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  let total = 0, ok = 0, fail = 0;

  for (const [cat, urls] of Object.entries(IMAGES)) {
    const dir = path.join(STOCK_DIR, cat);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < urls.length; i++) {
      total++;
      const filepath = path.join(dir, `${i + 1}.jpg`);
      if (fs.existsSync(filepath) && fs.statSync(filepath).size > 10000) {
        console.log(`  skip ${cat}/${i + 1}.jpg (exists)`);
        ok++;
        continue;
      }
      try {
        await download(urls[i], filepath);
        const size = fs.statSync(filepath).size;
        if (size < 5000) {
          fs.unlinkSync(filepath);
          throw new Error('too small: ' + size);
        }
        console.log(`  ✓ ${cat}/${i + 1}.jpg (${(size / 1024).toFixed(0)}KB)`);
        ok++;
      } catch (e) {
        console.error(`  ✗ ${cat}/${i + 1}.jpg — ${e.message}`);
        fail++;
      }
    }
    console.log(`${cat}: done`);
  }

  console.log(`\n총 ${total}장 중 ${ok}장 성공, ${fail}장 실패`);
})();
