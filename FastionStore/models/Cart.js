import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Product model se link karne ke liye
        required: true 
    },
    variantId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: false 
    },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // User model se link karne ke liye (Unique Cart per User)
        required: true,
        unique: true 
    },
    items: [cartItemSchema] // Ek user ki cart me multiple items ho sakte hain
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;