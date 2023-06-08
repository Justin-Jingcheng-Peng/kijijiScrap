import mongoose from "mongoose";

const uri =
  "mongodb+srv://justinpeng1209:pjc031209@clusterwebscrapper.aeknvag.mongodb.net/?retryWrites=true&w=majority";

// The function used for testing purposes
async function test() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    // Access the "postings" collection
    const collection = db.collection("postings");

    // Insert a new document
    const newPosting = {
      title: "New Posting",
      price: "$100.00",
      distance: "< 1 km",
      location: "Toronto",
      date: "06/07/2023",
    };

    collection.insertOne(newPosting, (err, result) => {
      if (err) {
        console.log("Error inserting document:", err);
      } else {
        console.log("Document inserted successfully");
        console.log(result);
      }

      // Close the MongoDB connection when you're done
      mongoose.connection.close();
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

test();
