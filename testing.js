import puppeteer from "puppeteer";

// Write a function to delay for 1 second
async function delayNSecond(n) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * n);
  });
}
async function getTargetURLFromCenterAndRadius(areaCode, radius) {
  // Create a new browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  // Configure the user agent to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
  );

  // Navigate to the website
  await page.goto("https://www.kijiji.ca");
  let button = await page.$("#SearchLocationPicker");
  await button.click();
  await delayNSecond(1);

  const inputElement = await page.$("#SearchLocationSelector-input");
  await inputElement.type(areaCode);
  await delayNSecond(1);
  await page.keyboard.press("Enter");
  await delayNSecond(1);
  const applyButton = await page.$x("//button[contains(text(), 'Apply')]");
  await applyButton[0].click();
  await delayNSecond(10);
  const currentURL = page.url();

  const newURL = customizeURLWithRadius(currentURL, radius);
  await page.goto(newURL);
  await delayNSecond(5);

  console.log(newURL);

  const allCategoryButton = await page.$(".label-2246511109");
  await allCategoryButton.click();

  const realEstateButton = await page.$x(
    "//div[contains(text(), 'Real Estate')]"
  );
  await realEstateButton[0].click();
  await delayNSecond(5);

  const searchButton = await page.$('button[name="SearchSubmit"]');
  await searchButton.click();
  await delayNSecond(5);

  const div = await page.$("div.slider-2889926755");
  const link = await div.$("a");
  await link.click();
  await delayNSecond(5);

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  await browser.close();
  return customizeURLWithRadius(currentURL, radius);
}

function customizeURLWithRadius(originalURL, radius) {
  // Split the original URL into parts using the "&radius=" parameter
  const urlParts = originalURL.split("&radius=");

  // Check if the URL has the expected format
  if (urlParts.length === 2) {
    // Construct the customized URL by replacing the radius value with the input
    const customizedURL = `${
      urlParts[0]
    }&radius=${radius}${urlParts[1].substring(urlParts[1].indexOf("&"))}`;
    return customizedURL;
  } else {
    // If the URL format is unexpected, return the original URL
    return originalURL;
  }
}

await getTargetURLFromCenterAndRadius("C1E 2G3", 90.0);
