import kijiji from "kijiji-scraper";

import { storeDataListInFirestore, deleteCollection } from "./dbOperations.js";

const options = {
  // minResults: -1,
  maxResults: 10,
};

const params = {
  locationId: kijiji.locations.ONTARIO.KITCHENER_AREA.KITCHENER_WATERLOO, // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
  categoryId: kijiji.categories.REAL_ESTATE.FOR_RENT.SHORT_TERM_RENTALS, // Same as kijiji.categories.CARS_AND_VEHICLES
  sortByName: "priceAsc", // Show the cheapest listings first
};

async function scrapKijijiAndPopulateListingsToDB(collectionName) {
  kijiji
    .search(params, options)
    .then((ads) => {
      storeDataListInFirestore(ads, collectionName);
    })
    .catch(console.error);
}

// await deleteCollection("listing");
await scrapKijijiAndPopulateListingsToDB("listing");
