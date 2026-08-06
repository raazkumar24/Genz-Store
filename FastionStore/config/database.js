//cannecting to the database 
import mongoose from "mongoose";

//in dono line ko hum sidha server js me likh skte the, but humne alag file me likha taki code clean rahe aur reusability ho.
import dotenv from "dotenv";
dotenv.config(); // ye line .env file ko load kar rahi hai, taki hum process.env.MONGO_URI ka use kar sakein.

const connectDB = async () => { //async function ka use kiya hai kyunki mongoose.connect ek asynchronous operation hai.
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { // ye line database se connect kar rahi hai, process.env.MONGO_URI me humara database ka URI hoga.
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }   
};

export default connectDB;

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("Database connected successfully! 🎉"))
//   .catch((err) => console.log("Database connection error: ❌", err));
