// import express from 'express';
// import cors from 'cors'; // ye backend ko frontend ke saath connect karne me help karega, jaise ki React app se data fetch karna.
// // import bcrypt from 'bcrypt'; // ye password ko hash karne me help karega, security ke liye.
// import connectDB from './config/database.js'; // ye humare database connection ko import kar raha hai.
// import porductRoutes from './routes/productRoutes.js'; // ye humare product related routes ko import kar raha hai.
// import authRoutes from './routes/authRoutes.js'; // ye humare authentication related routes ko import kar raha hai.
// // import dotenv from 'dotenv'; // ye environment variables ko load karne me help karega, jaise ki database URI.

// // dotenv.config(); // ye line .env file ko load kar rahi hai, taki hum process.env.MONGO_URI ka use kar sakein.

// // Connect to the database
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// //temporary product data 
// // const products = [
// //     {
// //         id:1,
// //         name:"Denim Jeans",
// //         price: 49.99,
// //         description: "Classic denim jeans with a comfortable fit.",
// //         image: "https://example.com/images/denim-jeans.jpg"
// //     },

// //     {
// //         id:2,
// //         name:"Leather Jacket",
// //         price: 149.99,
// //         description: "Stylish leather jacket for a trendy look.",
// //         image: "https://example.com/images/leather-jacket.jpg"
// //     },

// //     {
// //         id:3,
// //         name:"Sneakers",
// //         price: 79.99,
// //         description: "Comfortable sneakers for everyday wear.",
// //         image: "https://example.com/images/sneakers.jpg"
// //     }
// // ]

// //API endpoint to get all products
// // app.get('/api/products', (req, res) => {
// //     res.json(products);
// // });
// app.use('/api/products', porductRoutes); // ye line product related routes ko use kar rahi hai, jaise ki getAllProducts aur getProductById.



// //API endpoint to get a specific product by ID
// // app.get('/api/products/:id', (req, res) => {
// //     const productId = parseInt(req.params.id);
// //     const product = products.find(p => p.id === productId); 
// //     if (product) {
// //         res.json(product);
// //     } else {
// //         res.status(404).json({ message: 'Product not found' });
// //     }
// // });
// // Dynamic Route: Kisi ek product aur uske similar items ke liye
// app.get('/api/products/:id', (req, res) => {
//     // URL se ID nikalna (:id ki wajah se req.params.id milega)
//     const productId = parseInt(req.params.id); 
    
//     // 1. Current Product dhoondhna
//     const product = products.find(p => p.id === productId);
    
//     if (!product) {
//         return res.status(404).json({ message: "Product nahi mila! ❌" });
//     }

//     // 2. Similar Products dhoondhna (Abhi dummy data me hum baaki bache products dikha rahe hain)
//     const similarProducts = products.filter(p => p.id !== productId);

//     // Dono data ko ek sath front-end ko bhejna
//     res.json({
//         productDetails: product,
//         similarProducts: similarProducts
//     });
// });


// // API endpoint to register a new user
// app.post('/api/register', async (req, res) => { //async function ka use kiya hai kyunki bcrypt.hash ek asynchronous operation hai.
//     try {
//     const { username, password, email } = req.body; // is line ka mtlab hai ki hum request body se username aur password nikal rahe hain.

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10); // ye line password ko hash kar rahi hai, 10 rounds of salting ke sath.

//     console.log("Secure Password to Save:", hashedPassword);
//     // Here you would typically save the user to a database
//     // For now, we'll just send a success response
//     res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'kuchh to gadbad hai daya' });
//     }
// });


// // API endpoint to login a user
// // Login Route
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Database se user ko email ke zariye dhoondhna (Abhi hum dummy check kar rahe hain)
//         // const user = await User.findOne({ email });

//         // 2. Password match karna
//         // 'password' asli wala hai aur 'user.password' database wala hash hai
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ message: "Galat password! ❌" });
//         }

//         res.json({ message: "Login safal raha! 🔓" });
//     } catch (error) {
//         res.status(500).json({ message: "Server me koi dikkat hai!" });
//     }
// });

// app.get('/', (req, res) => {
//   res.send('Dekh bhai server chal raha hai');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // ye line .env file ko load kar rahi hai, taki hum process.env.MONGO_URI ka use kar sakein.

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
 
// / route
app.get('/', (req, res) => {
  res.send('Dekh bhai server chal raha hai');
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// reboot