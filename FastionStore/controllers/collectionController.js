import Collection from '../models/Collection.js';

const defaultCollections = [
  {
    name: "Oversized Tees",
    slug: "oversized-tees",
    subtitle: "Relaxed Fit",
    image: "/models/model1.png",
    link: "/collections/oversized-tees",
    bgColor: "bg-[#e0f2fe]",
    colSpan: "md:col-span-4",
    height: "h-[350px] md:h-[500px]",
    order: 1
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    subtitle: "Cozy Essentials",
    image: "/models/model3.png",
    link: "/collections/hoodies",
    bgColor: "bg-[#ffedd5]",
    colSpan: "md:col-span-4",
    height: "h-[350px] md:h-[500px]",
    order: 2
  },
  {
    name: "Cargos",
    slug: "cargos",
    subtitle: "Relaxed Fit Cargos",
    image: "/collections/baggy_pants.png",
    link: "/collections/cargos",
    bgColor: "bg-[#f1f5f9]",
    colSpan: "md:col-span-8",
    height: "h-[350px] md:h-[500px]",
    order: 3
  },
  {
    name: "Menswear",
    slug: "men",
    subtitle: "Modern Tailoring",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80",
    link: "/collections/men",
    bgColor: "bg-[#f3e8ff]",
    colSpan: "md:col-span-6",
    height: "h-[300px] md:h-[400px]",
    order: 4
  },
  {
    name: "Womenswear",
    slug: "women",
    subtitle: "The New Elegance",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
    link: "/collections/women",
    bgColor: "bg-[#ffe4e6]",
    colSpan: "md:col-span-6",
    height: "h-[300px] md:h-[400px]",
    order: 5
  }
];

// 🌍 Get All Collections (auto-seeds defaults if empty)
export const getAllCollections = async (req, res) => {
  try {
    let collections = await Collection.find().sort({ order: 1 });
    
    if (!collections || collections.length === 0) {
      // Seed default collections into DB
      collections = await Collection.insertMany(defaultCollections);
    }

    res.status(200).json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Failed to fetch collections", error: error.message });
  }
};

// 👑 Create Collection (Admin Only)
export const createCollection = async (req, res) => {
  try {
    const { name, slug, subtitle, link, bgColor, colSpan, height, order } = req.body;
    let image = req.body.image || '';

    // If image file was uploaded
    if (req.files && req.files.length > 0) {
      const uploadedFile = req.files[0];
      image = uploadedFile.secure_url || uploadedFile.url || `/uploads/${uploadedFile.filename}`;
    }

    if (!name || !image) {
      return res.status(400).json({ message: "Collection name and image are required" });
    }

    const generatedSlug = slug 
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const generatedLink = link || `/collections/${generatedSlug}`;

    const newCollection = new Collection({
      name,
      slug: generatedSlug,
      subtitle: subtitle || '',
      image,
      link: generatedLink,
      bgColor: bgColor || 'bg-[#f1f5f9]',
      colSpan: colSpan || 'md:col-span-6',
      height: height || 'h-[350px] md:h-[500px]',
      order: order ? Number(order) : 0
    });

    await newCollection.save();
    res.status(201).json({ message: "Collection created successfully", collection: newCollection });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Failed to create collection", error: error.message });
  }
};

// 👑 Update Collection (Admin Only)
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, subtitle, link, bgColor, colSpan, height, order, isActive } = req.body;

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (name) collection.name = name;
    if (slug) collection.slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (subtitle !== undefined) collection.subtitle = subtitle;
    if (link) collection.link = link;
    if (bgColor) collection.bgColor = bgColor;
    if (colSpan) collection.colSpan = colSpan;
    if (height) collection.height = height;
    if (order !== undefined) collection.order = Number(order);
    if (isActive !== undefined) collection.isActive = Boolean(isActive);

    // If new image uploaded
    if (req.files && req.files.length > 0) {
      const uploadedFile = req.files[0];
      collection.image = uploadedFile.secure_url || uploadedFile.url || `/uploads/${uploadedFile.filename}`;
    } else if (req.body.image) {
      collection.image = req.body.image;
    }

    await collection.save();
    res.status(200).json({ message: "Collection updated successfully", collection });
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ message: "Failed to update collection", error: error.message });
  }
};

// 👑 Delete Collection (Admin Only)
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Collection.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Failed to delete collection", error: error.message });
  }
};

// 👑 Reset to Default Collections (Admin Only)
export const resetDefaultCollections = async (req, res) => {
  try {
    await Collection.deleteMany({});
    const collections = await Collection.insertMany(defaultCollections);
    res.status(200).json({ message: "Collections reset to defaults successfully", collections });
  } catch (error) {
    console.error("Error resetting collections:", error);
    res.status(500).json({ message: "Failed to reset collections", error: error.message });
  }
};
