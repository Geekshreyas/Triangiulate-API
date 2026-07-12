const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
        console.log('BROWSER_ERROR:', msg.text());
    } else {
        console.log('BROWSER_LOG:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE_ERROR:', err.toString());
  });

  page.on('requestfailed', request => {
    console.log('REQUEST_FAILED:', request.url(), request.failure().errorText);
  });

  console.log("Navigating to localhost:5173...");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
