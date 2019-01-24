const puppeteer = require('puppeteer');

const args = process.argv.splice(2)
console.log(args);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3100/#/customize/genessential/pdf-report/' + args[0],
    {
      waitUntil: 'networkidle2'
    });
  await page.pdf({
    path: '/Users/leamoliu/Documents/example2.pdf',
    format: 'A4',
    printBackground: true
  });

  await browser.close();
})();
