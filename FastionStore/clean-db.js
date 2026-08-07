import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const productSchema = new mongoose.Schema({
  category: { type: [String], default: [] },
  collection: { type: [String], default: [] }
}, { strict: false });
const Product = mongoose.model('ProductMasterClean', productSchema, 'products');

function parseArrayField(input) {
  if (!input) return [];
  let rawItems = [];
  if (Array.isArray(input)) {
    rawItems = input;
  } else if (typeof input === 'string') {
    let str = input.trim();
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) rawItems = parsed;
        else rawItems = [parsed];
      } catch (e) {
        str = str.slice(1, -1);
        rawItems = str.split(',');
      }
    } else {
      rawItems = str.split(',');
    }
  }

  const result = [];
  for (let item of rawItems) {
    if (typeof item === 'string') {
      let cleanStr = item.replace(/^[\["'\\\s]+|[\]"'\\\s]+$/g, '').trim();
      if (cleanStr.includes(',')) {
        cleanStr.split(',').forEach(sub => {
          const subClean = sub.replace(/^[\["'\\\s]+|[\]"'\\\s]+$/g, '').trim();
          if (subClean) result.push(subClean);
        });
      } else if (cleanStr) {
        result.push(cleanStr);
      }
    } else if (item) {
      result.push(String(item).trim());
    }
  }
  return [...new Set(result)];
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  let count = 0;
  for (let p of products) {
    let newCats = parseArrayField(p.category);
    let newCols = parseArrayField(p.collection);
    
    p.category = newCats;
    p.collection = newCols;
    p.markModified('category');
    p.markModified('collection');
    await p.save();
    count++;
  }
  console.log('Successfully cleaned ' + count + ' products in DB!');
  mongoose.disconnect();
}
run();
