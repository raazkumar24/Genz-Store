import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Cart from "../models/Cart.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        // create password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration!" });
    }

};

    //login and use jwt
export const loginUser = async (req, res) => {
    try {
        const { email, password, localCartItems } = req.body; // 📥 Local items receive kiye

        // 1. Email aur Password check karna
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Email ya Password! ❌" });
        }

        // 2. JWT Token banana
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // 3. 🔄 CART MERGING LOGIC START
        if (localCartItems && localCartItems.length > 0) {
            let dbCart = await Cart.findOne({ user: user._id });

            if (!dbCart) {
                // Agar database me koi cart nahi thi, toh local items se nayi cart bana do
                await Cart.create({ user: user._id, items: localCartItems });
            } else {
                // Agar pehle se cart hai, toh dono ko merge karo
                localCartItems.forEach(localItem => {
                    const existingItemIndex = dbCart.items.findIndex(dbItem => 
                        dbItem.product.toString() === localItem.product &&
                        dbItem.color === localItem.color &&
                        dbItem.size === localItem.size
                    );

                    if (existingItemIndex > -1) {
                        // Same item mila, toh quantity jod do
                        dbCart.items[existingItemIndex].quantity += localItem.quantity;
                    } else {
                        // Naya item hai, toh array me add kar do
                        dbCart.items.push(localItem);
                    }
                });
                await dbCart.save(); // Database me save karein
            }
        }

        // 4. Response bhejna
        res.status(200).json({
            message: "Login aur Cart sync safal raha! 🔓",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error ❌", error: error.message });
    }
};



