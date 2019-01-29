const puppeteer = require('puppeteer');

const args = process.argv.splice(2)
console.log(args);

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://z.mdhcare.cn/#/customize/genessential/pdf-report/' + args[0],
    {
      waitUntil: 'networkidle0',
      timeout: 0
    });
  await page.pdf({
    path: '/data/mdh/pdf/genessential/' + args[0] + '.pdf',
    format: 'A4',
    printBackground: true
  });

  await browser.close();
})();
