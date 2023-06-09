import puppeteer from "puppeteer";

async function test() {
  // Create a new browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  // Configure the user agent to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
  );

  // Navigate to the website
  await page.goto("https://www.kijiji.ca");

  const divSelector = "#cat-menu-item-34";
  const divElement = await page.$(divSelector);
  const navigationPromise = page.waitForNavigation();
  await Promise.all([divElement.click(), navigationPromise]);
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
}

await test();
