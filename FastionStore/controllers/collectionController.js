import Collection from '../models/Collection.js';

export const defaultCollections = [
  {
    _id: "default-1",
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
    _id: "default-2",
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
    _id: "default-3",
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
    _id: "default-4",
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
    _id: "default-5",
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

let inMemoryCollections = JSON.parse(JSON.stringify(defaultCollections));

// 🌍 Get All Collections (auto-seeds defaults if empty)
export const getAllCollections = async (req, res) => {
  try {
    let collections = await Collection.find().sort({ order: 1 });
    
    if (!collections || collections.length === 0) {
      try {
        collections = await Collection.insertMany(defaultCollections);
      } catch (e) {
        collections = inMemoryCollections;
      }
    }

    return res.status(200).json(collections);
  } catch (error) {
    return res.status(200).json(inMemoryCollections);
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

    const collectionData = {
      _id: `col-${Date.now()}`,
      name,
      slug: generatedSlug,
      subtitle: subtitle || '',
      image,
      link: generatedLink,
      bgColor: bgColor || 'bg-[#f1f5f9]',
      colSpan: colSpan || 'md:col-span-6',
      height: height || 'h-[350px] md:h-[500px]',
      order: order ? Number(order) : inMemoryCollections.length + 1
    };

    try {
      const newCollection = new Collection(collectionData);
      await newCollection.save();
      inMemoryCollections.push(newCollection.toObject());
      return res.status(201).json({ message: "Collection created successfully", collection: newCollection });
    } catch (dbErr) {
      inMemoryCollections.push(collectionData);
      return res.status(201).json({ message: "Collection created successfully", collection: collectionData });
    }
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

    let updateObj = {};
    if (name) updateObj.name = name;
    if (slug) updateObj.slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (subtitle !== undefined) updateObj.subtitle = subtitle;
    if (link) updateObj.link = link;
    if (bgColor) updateObj.bgColor = bgColor;
    if (colSpan) updateObj.colSpan = colSpan;
    if (height) updateObj.height = height;
    if (order !== undefined) updateObj.order = Number(order);
    if (isActive !== undefined) updateObj.isActive = Boolean(isActive);

    // If new image uploaded
    if (req.files && req.files.length > 0) {
      const uploadedFile = req.files[0];
      updateObj.image = uploadedFile.secure_url || uploadedFile.url || `/uploads/${uploadedFile.filename}`;
    } else if (req.body.image) {
      updateObj.image = req.body.image;
    }

    let updated = null;
    try {
      updated = await Collection.findByIdAndUpdate(id, { $set: updateObj }, { returnDocument: 'after' });
    } catch (dbErr) {
      // ignore
    }

    const idx = inMemoryCollections.findIndex(c => c._id === id || String(c._id) === String(id));
    if (idx > -1) {
      inMemoryCollections[idx] = { ...inMemoryCollections[idx], ...updateObj };
      if (!updated) updated = inMemoryCollections[idx];
    }

    if (!updated) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ message: "Collection updated successfully", collection: updated });
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ message: "Failed to update collection", error: error.message });
  }
};

// 👑 Delete Collection (Admin Only)
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Collection.findByIdAndDelete(id);
    } catch (dbErr) {
      // ignore
    }

    inMemoryCollections = inMemoryCollections.filter(c => c._id !== id && String(c._id) !== String(id));
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Failed to delete collection", error: error.message });
  }
};

// 👑 Reset to Default Collections (Admin Only)
export const resetDefaultCollections = async (req, res) => {
  try {
    try {
      await Collection.deleteMany({});
      await Collection.insertMany(defaultCollections);
    } catch (dbErr) {
      // ignore
    }
    inMemoryCollections = JSON.parse(JSON.stringify(defaultCollections));
    res.status(200).json({ message: "Collections reset to defaults successfully", collections: inMemoryCollections });
  } catch (error) {
    console.error("Error resetting collections:", error);
    res.status(500).json({ message: "Failed to reset collections", error: error.message });
  }
};
