import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import heroConfigRoutes from './routes/heroConfigRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Fastion Store API server is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Mount Application Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/hero-config', heroConfigRoutes);

// Start HTTP Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});