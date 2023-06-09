import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI;

export async function populateKijijiPostings(postings) {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    // Access the "postings" collection
    const collection = db.collection("postings");

    // Convert KijijiPosting objects to plain JavaScript objects
    const postingDocuments = postings.map((posting) => ({ ...posting }));

    // Insert the array of documents
    await collection.insertMany(postingDocuments, (err, result) => {
      if (err) {
        console.error("Error inserting documents:", err);
      } else {
        console.log("Documents inserted successfully");
        console.log(result);
      }
    });
    mongoose.connection.close();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    mongoose.connection.close();
  }
}

// Write a function do delete all entries in the "postings" collection
export async function deleteAllPostings() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const collection = db.collection("postings");
    await collection.deleteMany({});
    console.log("Deleted all postings");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
