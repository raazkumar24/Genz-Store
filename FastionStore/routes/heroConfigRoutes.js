import express from 'express';
import {
  getHeroConfig,
  updateHeroConfig,
  uploadHeroImage,
  resetHeroConfig,
} from '../controllers/heroConfigController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { upload, pushToCloudinary } from '../config/uploadConfig.js';

const router = express.Router();

// 🌍 Public Route: Fetch live Hero and Lookbook configuration for storefront
router.get('/', getHeroConfig);

// 👑 Protected Admin Routes: Save text, upload images, reset
router.put('/', authMiddleware, adminMiddleware, updateHeroConfig);
router.post('/upload-image', authMiddleware, adminMiddleware, upload.any(), pushToCloudinary, uploadHeroImage);
router.post('/reset', authMiddleware, adminMiddleware, resetHeroConfig);

export default router;
