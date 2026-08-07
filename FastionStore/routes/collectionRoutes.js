import express from 'express';
import { 
  getAllCollections, 
  createCollection, 
  updateCollection, 
  deleteCollection,
  resetDefaultCollections 
} from '../controllers/collectionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { upload, pushToCloudinary } from '../config/uploadConfig.js';

const router = express.Router();

// 🌍 Public route
router.get('/', getAllCollections);

// 👑 Protected Admin routes
router.post('/add', authMiddleware, adminMiddleware, upload.any(), pushToCloudinary, createCollection);
router.put('/:id', authMiddleware, adminMiddleware, upload.any(), pushToCloudinary, updateCollection);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCollection);
router.post('/reset', authMiddleware, adminMiddleware, resetDefaultCollections);

export default router;
