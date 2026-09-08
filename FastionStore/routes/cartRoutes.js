import express from 'express';
import { 
  addToCart, 
  getCart, 
  updateCart, 
  removeFromCart, 
  clearCart, 
  syncCart 
} from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🛒 Cart endpoints (protected / guest-friendly with authMiddleware)
router.get('/', authMiddleware, getCart);
router.get('/:userId', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/update', authMiddleware, updateCart);
router.delete('/remove', authMiddleware, removeFromCart);
router.post('/clear', authMiddleware, clearCart);
router.post('/sync', authMiddleware, syncCart);

export default router;