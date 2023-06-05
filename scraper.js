const puppeteer = require("puppeteer");

async function scrapeWebsite() {
  // Create a new browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Configure the user agent to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
  );

  // Navigate to the website
  await page.goto(
    "https://www.kijiji.ca/b-apartments-condos/city-of-toronto/house/c37l1700273a29276001?ll=43.646481%2C-79.396836&address=Adelaide+Street+West%2C+Toronto%2C+ON&radius=3.0"
  );

  const divs = await page.$$eval("div.clearfix", (elements) => {
    return elements.map((element) => element.innerHTML);
  });

  console.log(divs[0]);

  // Close the browser
  await browser.close();
}

scrapeWebsite();
