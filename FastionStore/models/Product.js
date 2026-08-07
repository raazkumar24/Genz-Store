import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: '' },
  isSale: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  keywords: [{ type: String }],
  stock: { type: Number, required: true },
  images: [{ type: String }]
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  brand: { type: String, default: '' },
  category: { type: [String], default: ['Uncategorized'] },
  collection: { type: [String], default: [] },
  productDetails: {
    topHighlights: [{ type: String }],
    specifications: [{ key: String, value: String }],
    style: { type: String, default: '' },
    itemDetails: { type: String, default: '' }
  },
  variants: [variantSchema]   // One-to-Many Relationship!
}, { timestamps: true }); // Isse hooks automatically create/update time note kar lenge

const Product = mongoose.model('Product', productSchema);
export default Product;
