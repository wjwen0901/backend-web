const puppeteer = require('puppeteer');

const args = process.argv.splice(2)
console.log(args);
console.log(args[1]);
console.log(args[1]);

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const pageInfo = 'https://z.mdhcare.cn/#/customize/genessential/' + (args[1] === 'skin' ? 'pdf-report' : 'sport-report') + '/' + args[0];
  console.log(pageInfo);
  await page.goto(pageInfo,
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
  console.log('http://localhost:3100/#/customize/genessential/' + args[1] == 'skin' ? 'pdf-report' : 'sport-report' + '/' + args[0]);
  console.log('/Users/leamoliu/mdhcare/data/mdh/pdf/genessential/' + args[0] + '.pdf');
  console.log('end');
})();

