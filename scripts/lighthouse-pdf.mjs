import puppeteer from 'puppeteer';
import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const ROOT = resolve('./lighthouse-reports');
const SUBFOLDERS = ['app', 'hrnet'];

const toConvert = [];

for (const sub of SUBFOLDERS) {
  const srcDir = `${ROOT}/${sub}`;
  const pdfDir = `${srcDir}/pdf`;

  if (!existsSync(srcDir)) continue;

  mkdirSync(pdfDir, { recursive: true });

  const existingPdfs = new Set(readdirSync(pdfDir));
  const htmlFiles = readdirSync(srcDir).filter(
    (f) => f.endsWith('.html') && !existingPdfs.has(basename(f, '.html') + '.pdf'),
  );

  for (const file of htmlFiles) {
    toConvert.push({ srcDir, pdfDir, file });
  }
}

if (toConvert.length === 0) {
  console.log('No new HTML reports to convert (all already have a matching PDF).');
  process.exit(0);
}

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

for (const { srcDir, pdfDir, file } of toConvert) {
  const src = `file:///${srcDir.replace(/\\/g, '/')}/${file}`;
  const dest = `${pdfDir}/${basename(file, '.html')}.pdf`;
  const page = await browser.newPage();
  await page.emulateMediaType('screen');
  await page.goto(src, { waitUntil: 'networkidle0' });
  // Freeze CSS animations so gauge circles render fully before snapshot
   
  await page.evaluate(() => {
    /* global document */
    const style = document.createElement('style');
    style.textContent = `*, *::before, *::after {
      animation-delay: -1ms !important;
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0ms !important;
    }`;
    document.head.appendChild(style);
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.pdf({ path: dest, format: 'A4', printBackground: true });
  await page.close();
  console.log(`✓ ${dest.replace(/\\/g, '/')}`);
}

await browser.close();
console.log(`\nDone — ${toConvert.length} new PDF(s) saved.`);
process.exit(0);
