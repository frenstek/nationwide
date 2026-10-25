import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'NPI-Capability-Statement.html');
const outputPath = path.join(process.env.USERPROFILE, 'Downloads', 'NPI_Capability_Statement.pdf');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Load the HTML file
  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for images to load
  await page.evaluate(async () => {
    const images = document.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
    // Also wait for background images
    await new Promise(r => setTimeout(r, 3000));
  });

  console.log('Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`PDF saved to: ${outputPath}`);
})();
