import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { upload, pushToCloudinary } from '../config/uploadConfig.js';

const router = express.Router();

// 🌍 Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// 👑 Protected Route: Pehle authentication check hoga, fir role check hoga, aur ant me product save hoga!
router.put('/:id', authMiddleware, adminMiddleware, upload.any(), pushToCloudinary, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
router.post('/add', authMiddleware, adminMiddleware, upload.any(), pushToCloudinary, addProduct);

export default router;