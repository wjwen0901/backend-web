const puppeteer = require('puppeteer');

const args = process.argv.splice(2)
console.log(args);
console.log(args[1]);
console.log(args[1]);

(async () => {
  // 在浏览器上设置的一组可配置选项
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

  //返回一个新的Page对象。Page 在一个默认的浏览器上下文中被创建。
  const page = await browser.newPage();

  const pageInfo = 'https://z.mdhcare.cn/#/customize/genessential/' + (args[1] === 'skin' ? 'pdf-nuokang' : 'sport-report') + '/' + args[0];
  //console.log(pageInfo);

  // page.goto(url[, options])抛出或返回主页面的响应:url:导航到的地址;timeout:跳转等待时间(毫秒);waitUntil:满足什么条件认为页面跳转完成;networkidle0:不再有网络连接时触发（至少500毫秒后）
  await page.goto(pageInfo,
    {
      waitUntil: 'networkidle0',
      timeout: 0
    });

  //生成当前页面的pdf格式: path:pdf文件保存的路径;printBackground:是否打印背景图;format:页面格式;
  await page.pdf({
    path: '/data/mdh/pdf/genessential/' + args[0] + '.pdf',
    format: 'A4',
    printBackground: true
  });
  // 关闭 Chromium 及其所有页面(如果页面被打开的话)
  await browser.close();

  // console.log('http://localhost:3100/#/customize/genessential/' + args[1] == 'skin' ? 'pdf-nuokang' : 'sport-report' + '/' + args[0]);
  // console.log('/Users/leamoliu/mdhcare/data/mdh/pdf/genessential/' + args[0] + '.pdf');
  // console.log('end');
})();
