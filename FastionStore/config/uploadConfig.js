import multer from 'multer';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import cloudinaryPkg from 'cloudinary';
const cloudinary = cloudinaryPkg.v2;

// 🔑 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure local uploads directory exists temporarily
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📦 Use Disk Storage (Step 1: Save locally)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 🛠️ The Local Uploader Middleware
export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// 🚀 Step 2: Push to Cloudinary and Delete Local File
export const pushToCloudinary = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const uploadPromises = req.files.map(async (file) => {
      // Upload physical file to Cloudinary (extremely stable, retries on bad connection)
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'clothing_store_products',
        resource_type: 'image',
        timeout: 120000 // 2 minute timeout for bad internet
      });

      // Update the file object with Cloudinary URLs so the controller uses them
      file.secure_url = result.secure_url;
      file.url = result.url;
      file.public_id = result.public_id;

      // STEP 3: Delete the local file now that it's safe in Cloudinary
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.error("Error deleting local file:", err);
      }
    });

    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    console.error("Cloudinary Hybrid Upload Error, falling back to local files:", error.message || JSON.stringify(error));
    
    // Fallback to local files on failure (DO NOT delete them)
    req.files.forEach(file => {
      const localUrl = `http://localhost:5000/uploads/${file.filename}`;
      // Set the Cloudinary-like fields so controllers work seamlessly
      file.secure_url = localUrl;
      file.url = localUrl;
      file.public_id = file.filename;
    });

    // Continue to controller
    next();
  }
};
