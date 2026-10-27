import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  id: { type: String, default: () => `slide-${Date.now()}` },
  number: { type: String, default: "01" },
  badge: { type: String, default: "DROP 04 - 2026" },
  tag: { type: String, default: "OVERSIZED FIT" },
  title: { type: String, default: "Heavyweight Boxy Streetwear." },
  specHeadline: { type: String, default: "Clear Silhouettes" },
  specDetail: { type: String, default: "280 GSM combed organic cotton with relaxed drop-shoulder cut and anti-fade reactive dye." },
  primaryCta: { type: String, default: "Explore Drop 04" },
  primaryLink: { type: String, default: "/new-arrivals" },
  accentBadge: { type: String, default: "100% Supima Cotton" },
  stats: { type: String, default: "280 GSM • Heavy Combed" },
  image: { type: String, default: "/models/model1.png" },
}, { _id: false });

const heroSpotlightSchema = new mongoose.Schema({
  productId: { type: String, default: "" },
  targetCategory: { type: String, default: "hoodie" },
  badgeText: { type: String, default: "HEAVYWEIGHT 380 GSM" },
  title: { type: String, default: "TAGAS HOODIE FOR MEN SWEATSHIRT" },
  subtitle: { type: String, default: "Drop shoulder & double-needle ribbed hem." },
  tagPill: { type: String, default: "SIGNATURE FIT" },
  customPrice: { type: String, default: "549" },
  customImage: { type: String, default: "" },
  cardTheme: { type: String, default: "dark" },
}, { _id: false });

const tacticalDropSchema = new mongoose.Schema({
  tag: { type: String, default: "TRENDING CARGO" },
  badgeText: { type: String, default: "HEAVYWEIGHT 280 GSM" },
  title: { type: String, default: "SAMFOR PARACHUTE CARGO" },
  subtitle: { type: String, default: "Raw Ecru • Relaxed Fit" },
  brand: { type: String, default: "GENZ ARCHIVE" },
  image: { type: String, default: "/collections/baggy_pants.png" },
  link: { type: String, default: "/collections/cargos" },
  price: { type: String, default: "479" },
  originalPrice: { type: String, default: "799" },
}, { _id: false });

const lookbookCardSchema = new mongoose.Schema({
  id: { type: String, default: () => `card-${Date.now()}` },
  badgeLeft: { type: String, default: "" },
  badgeRight: { type: String, default: "" },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  buttonText: { type: String, default: "SHOP THIS LOOK" },
  image: { type: String, default: "" },
  link: { type: String, default: "/new-arrivals" },
}, { _id: false });

const archivedCatalogSchema = new mongoose.Schema({
  campaignTag: { type: String, default: "02 - CURATED CAMPAIGN LOOKBOOK" },
  sectionTitle: { type: String, default: "THIS SEASON'S" },
  sectionSubtitle: { type: String, default: "winter drops" },
  seeAllText: { type: String, default: "VIEW COMPLETE ARCHIVE (09)" },
  seeAllLink: { type: String, default: "/new-arrivals" },
  cards: [lookbookCardSchema],
}, { _id: false });

const heroConfigSchema = new mongoose.Schema({
  configKey: { type: String, default: "master_hero_config", unique: true, index: true },
  slides: [heroSlideSchema],
  spotlight: heroSpotlightSchema,
  tactical: tacticalDropSchema,
  archivedCatalog: archivedCatalogSchema,
}, { timestamps: true });

const HeroConfig = mongoose.model('HeroConfig', heroConfigSchema);
export default HeroConfig;
