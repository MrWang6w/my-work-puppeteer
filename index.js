const express = require('express');
const playwright = require('playwright');

const app = express();
const port = process.env.PORT || 3000;
console.log('playwright:', playwright);

app.get('/get', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);
  const screenshotBuffer = await page.screenshot();
  await browser.close();

  res.set('Content-Type', 'image/png');
  res.send(screenshotBuffer);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
