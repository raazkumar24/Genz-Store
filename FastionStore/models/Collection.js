import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String, default: "" },
  image: { type: String, required: true },
  link: { type: String, required: true },
  bgColor: { type: String, default: "bg-[#f1f5f9]" },
  colSpan: { type: String, default: "md:col-span-6" },
  height: { type: String, default: "h-[350px] md:h-[500px]" },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Collection', collectionSchema);
