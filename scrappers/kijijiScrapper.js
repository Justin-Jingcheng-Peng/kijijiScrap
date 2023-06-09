import puppeteer from "puppeteer";
import KijijiPosting from "../modules/Posting.js";
import { populateKijijiPostings, deleteAllPostings } from "../db.js";

async function scrapeWebsite() {
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
  await page.goto(
    "https://www.kijiji.ca/b-apartments-condos/city-of-toronto/apartment__condo/c37l1700273a29276001?ll=43.783033%2C-79.187381&address=University+of+Toronto+Scarborough%2C+Military+Trail%2C+Scarborough%2C+ON&radius=2.0"
  );

  const divsInfoContainer = await page.$$(".info-container");
  const bedroomSpans = await page.$$("span.bedrooms");
  const prices = [];
  const titles = [];
  const locations = [];
  const dates = [];
  const distances = [];
  const bedroomStrings = await Promise.all(
    bedroomSpans.map(async (span) => {
      const bedroomString = await page.evaluate(
        (element) => element.textContent.trim(),
        span
      );
      return bedroomString;
    })
  );
  // Write a function accepting strings and return the last token of the string

  const bedroomNumbers = bedroomStrings.map((string) => {
    const tokens = string.split(" ");
    const lastToken = tokens[tokens.length - 1];
    return lastToken;
  });
  console.log(bedroomNumbers);

  for (const div of divsInfoContainer) {
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

    prices.push(price[0]);
    titles.push(title[0]);
    locations.push(location[0]);
    dates.push(date[0]);
    distances.push(distance[0]);
  }
  await browser.close();
  const postings = [];

  for (let i = 0; i < prices.length; i++) {
    const posting = new KijijiPosting(
      titles[i],
      prices[i],
      distances[i],
      locations[i],
      dates[i],
      bedroomNumbers[i]
    );
    postings.push(posting);
  }
  await populateKijijiPostings(postings);
  console.log("Populated the latest postings to the database");
}

await scrapeWebsite();
