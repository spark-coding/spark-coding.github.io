// Renders hero-image-generator.html to src/assets/img/hero-builds.webp (transparent).
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1180, height: 1040, deviceScaleFactor: 1.5 });
    await page.goto('file://' + path.resolve(__dirname, '../hero-image-generator.html'), { waitUntil: 'load' });
    const scene = await page.$('#scene');
    const out = path.resolve(__dirname, '../src/assets/img/hero-builds.webp');
    await scene.screenshot({ path: out, type: 'webp', quality: 88, omitBackground: true });
    await browser.close();
    console.log('Wrote', path.relative(process.cwd(), out));
})();
