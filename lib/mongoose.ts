import mongoose from "mongoose";

let isConnected = false; // variable to check if mongodb is connected or not

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL is not found");
  if (isConnected) return console.log("Already connected");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "vichaar",
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
