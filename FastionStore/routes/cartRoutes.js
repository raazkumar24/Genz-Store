import express from 'express';
import { addToCart, getCart, updateCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🛒 Protected Route: Cart me item add karne ke liye login zaroori hai
// Endpoint: POST /api/cart/add
router.post('/add', authMiddleware, addToCart);

// 🛒 Protected Route: Cart me item remove karne ke liye login zaroori hai
// Endpoint: DELETE /api/cart/remove
router.delete('/remove', authMiddleware, removeFromCart);

// 🛒 Protected Route: Cart dekhne ke liye login zaroori hai
// Endpoint: GET /api/cart/:userId
router.get('/:userId', authMiddleware, getCart);

// 🛒 Protected Route: Cart me item update karne ke liye login zaroori hai
// Endpoint: PUT /api/cart/update
router.put('/update', authMiddleware, updateCart);

export default router;