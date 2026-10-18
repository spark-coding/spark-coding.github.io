// Renders each #slide-N in hero-image-generator.html to src/assets/img/hero-slide-N.webp (transparent).
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 800, deviceScaleFactor: 1.5 });
    await page.goto('file://' + path.resolve(__dirname, '../hero-image-generator.html'), { waitUntil: 'load' });
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++) {
        const out = path.resolve(__dirname, `../src/assets/img/hero-slide-${i + 1}.webp`);
        await slides[i].screenshot({ path: out, type: 'webp', quality: 88, omitBackground: true });
        console.log('Wrote', path.relative(process.cwd(), out));
    }
    await browser.close();
})();
