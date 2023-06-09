import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI;

// Define the schema for the "postings" collection
const postingSchema = new mongoose.Schema({
  title: String,
  price: String,
  distance: String,
  location: String,
  date: String,
  bedroomNumber: String,
});

// Create a model for the "postings" collection
const Posting = mongoose.model("Posting", postingSchema);

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");

    // Create a new document
    const newPosting = new Posting({
      title: "New Posting",
      price: "$100",
      distance: "5 km",
      location: "Toronto",
      date: "2023-06-07",
      bedroomNumber: "2",
    });

    // Save the new document to the "postings" collection
    return newPosting.save();
  })
  .then(() => {
    console.log("New posting saved successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
