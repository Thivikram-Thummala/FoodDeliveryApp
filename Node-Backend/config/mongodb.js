import "dotenv/config"
import mongoose from "mongoose";


async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGO_URI not set. Skipping MongoDB connection.");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    //process.exit(1);
  }
}

export default connectDb;