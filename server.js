import db from "./firebase.js";
import kijiji from "kijiji-scraper";
const collectionRef = db.collection("listing");

// collectionRef
//   .get()
//   .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, "=>", doc.data());
//     });
//   })
//   .catch((error) => {
//     console.error("Error getting documents:", error);
//   });
const storeDataListInFirestore = async (dataList, db, collectionName) => {
  try {
    const collectionRef = await db.collection(collectionName);
    const postingDocuments = dataList.map((info) => ({ ...info }));
    for (let i = 0; i < postingDocuments.length; i++) {
      delete postingDocuments[i].scrape;
      delete postingDocuments[i].isScraped;
    }

    const batchSize = 499; // Maximum number of writes per batch (leaving 1 write for potential delete operations)
    const batches = Math.ceil(postingDocuments.length / batchSize);

    for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
      const batch = db.batch(); // Create a batch object

      const start = batchIndex * batchSize;
      const end = start + batchSize;
      const currentBatch = postingDocuments.slice(start, end);

      currentBatch.forEach((data) => {
        const newDocRef = collectionRef.doc(); // Create a new document reference for each object
        batch.set(newDocRef, data); // Set the data for each document
      });

      await batch.commit(); // Commit the batch write
    }
    console.log("Data stored successfully in Firestore!");
  } catch (error) {
    console.error("Error storing data in Firestore:", error);
  }
};

async function deleteCollection(db, collectionRef) {
  const batchSize = 500;
  let querySnapshot = await collectionRef.limit(batchSize).get();

  while (!querySnapshot.empty) {
    const batch = db.batch();

    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Get the last document from the previous batch
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];

    // Construct the next query starting after the last document
    querySnapshot = await collectionRef
      .startAfter(lastDocument)
      .limit(batchSize)
      .get();
  }

  console.log("Collection deleted successfully!");
}

const options = {
  minResults: -1,
};

const params = {
  locationId: kijiji.locations.ONTARIO.KITCHENER_AREA.KITCHENER_WATERLOO, // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
  categoryId: kijiji.categories.REAL_ESTATE.FOR_RENT.SHORT_TERM_RENTALS, // Same as kijiji.categories.CARS_AND_VEHICLES
  sortByName: "priceAsc", // Show the cheapest listings first
};

async function scrapKijijiAndPopulateListingsToDB(collectionRef) {
  kijiji
    .search(params, options)
    .then((ads) => {
      storeDataListInFirestore(ads, db, "listing");
    })
    .catch(console.error);
}

// await deleteCollection(db, collectionRef);
await scrapKijijiAndPopulateListingsToDB(collectionRef);
