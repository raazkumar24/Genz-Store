import multer from 'multer';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import cloudinaryPkg from 'cloudinary';
const cloudinary = cloudinaryPkg.v2;

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Ensure local uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const pushToCloudinary = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  if (!hasCloudinary) {
    req.files.forEach(file => {
      file.secure_url = `/uploads/${file.filename}`;
      file.url = `/uploads/${file.filename}`;
      file.public_id = file.filename;
    });
    return next();
  }

  try {
    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'clothing_store_products',
        resource_type: 'image',
        timeout: 60000
      });

      file.secure_url = result.secure_url;
      file.url = result.url;
      file.public_id = result.public_id;

      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        // ignore
      }
    });

    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    console.warn("Cloudinary upload failed, using local uploads instead:", error.message);
    req.files.forEach(file => {
      file.secure_url = `/uploads/${file.filename}`;
      file.url = `/uploads/${file.filename}`;
      file.public_id = file.filename;
    });
    next();
  }
};
