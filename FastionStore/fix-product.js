import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.updateOne(
    { _id: '6a72f8a99a0af794207a76b8' },
    { $set: { category: ['T-Shirts'], collection: ['Men', 'Oversized', 'Trending'] } }
  );
  console.log('Fixed corrupted product');
  mongoose.disconnect();
}
run();
