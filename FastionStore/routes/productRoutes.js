import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getPopularColors } from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { upload, pushToCloudinary } from '../config/uploadConfig.js';

const router = express.Router();

// 🌍 Public Routes
router.get('/', getAllProducts);
router.get('/popular-colors', getPopularColors);
router.get('/:id', getProductById);

// Protected Admin Routes: Require authenticated admin user
router.put('/:id', authMiddleware, adminMiddleware, upload.any(), pushToCloudinary, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
router.post('/add', authMiddleware, adminMiddleware, upload.any(), pushToCloudinary, addProduct);

export default router;