import kijiji from "kijiji-scraper";
// Scrape using returned promise

const options = {
  minResults: 20,
};

const params = {
  locationId: kijiji.locations.ONTARIO.KITCHENER_AREA.KITCHENER_WATERLOO, // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
  categoryId: kijiji.categories.REAL_ESTATE.FOR_RENT, // Same as kijiji.categories.CARS_AND_VEHICLES
  sortByName: "priceAsc", // Show the cheapest listings first
};

// Scrape using returned promise
const res = await kijiji.search(params, options);

for (let i = 0; i < res.length; i++) {
  console.log(res[i]);
}
