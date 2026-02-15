const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 2000, deviceScaleFactor: 3 });

    const filePath = 'file://' + path.resolve(__dirname, 'brochure-bizcard.html');
    const outputDir = __dirname;
    await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait for fonts & icons to load
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 2000));

    const cards = await page.$$('.card-page');

    if (cards.length >= 2) {
        await cards[0].screenshot({ path: path.join(outputDir, 'bizcard-front.jpg'), type: 'jpeg', quality: 95 });
        console.log('Saved bizcard-front.jpg');

        await cards[1].screenshot({ path: path.join(outputDir, 'bizcard-back.jpg'), type: 'jpeg', quality: 95 });
        console.log('Saved bizcard-back.jpg');
    } else {
        console.log('ERROR: Found', cards.length, 'card-page elements');
    }

    await browser.close();
})();
