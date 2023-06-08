import puppeteer from "puppeteer";
import KijijiPosting from "./modules/Posting.js";

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

  const divs = await page.$$(".info-container");
  const prices = [];
  const titles = [];
  const locations = [];
  const dates = [];
  const distances = [];
  for (const div of divs) {
    const price = await div.$$eval(".price", (elements) =>
      elements.map((el) => (el ? el.textContent.trim() : "N/A"))
    );
    const title = await div.$$eval(".title", (elements) =>
      elements.map((el) => (el ? el.textContent.trim() : "N/A"))
    );

    const distance = await div.$$eval(".distance", (elements) =>
      elements.map((el) => (el ? el.textContent.trim() : "N/A"))
    );
    const location = await div.$$eval(
      ".location span:first-child",
      (elements) => elements.map((el) => (el ? el.textContent.trim() : "N/A"))
    );
    const date = await div.$$eval(".location span:last-child", (elements) =>
      elements.map((el) => (el ? el.textContent.trim() : "N/A"))
    );
    const description = await div.$$eval(".description", (elements) =>
      elements.map((el) => (el ? el.textContent.trim() : "N/A"))
    );
    prices.push(price[0]);
    titles.push(title[0]);
    locations.push(location[0]);
    dates.push(date[0]);
    distances.push(distance[0]);
  }
  await browser.close();
  const postings = [];

  for (let i = 0; i < prices.length - 1; i++) {
    const posting = new KijijiPosting(
      titles[i],
      prices[i],
      distances[i],
      locations[i],
      dates[i]
    );
    postings.push(posting);
  }
  console.log(postings);
}

scrapeWebsite();
