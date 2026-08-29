import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // fail fast if not connected
    if (process.env.MONGO_URI) {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      isConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.warn("No MONGO_URI provided in environment. Running with in-memory database fallback.");
    }
  } catch (error) {
    console.warn(`MongoDB not connected (${error.message}) — using in-memory store fallback for full functionality.`);
    isConnected = false;
  }
};

export const getIsConnected = () => isConnected;
export default connectDB;
