const express = require('express');
const puppeteer = require('puppeteer');

const app = express();


let browser;

async function getBrowserInstance() {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
  }
  return browser;
}


app.get('/', async (req, res) => {
  const { url } = req.query;

  // 创建浏览器实例
  const oneBrowser = await getBrowserInstance()

  // 打开一个新页面
  const page = await oneBrowser.newPage();

  // 进行页面访问
  await page.goto(url, { waitUntil: 'networkidle2' });

  // 截取图片
  const screenshot = await page.screenshot({ type: 'png' });

  // 关闭浏览器实例
  await oneBrowser.close();

  // 设置返回的内容为图片
  res.setHeader('Content-Type', 'image/png');
  res.send(screenshot);
});

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});