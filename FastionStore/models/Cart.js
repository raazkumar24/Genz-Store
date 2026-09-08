import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: false 
    },
    productId: { 
        type: String, 
        required: true 
    },
    variantId: { 
        type: String, 
        default: "" 
    },
    name: { 
        type: String, 
        default: "Streetwear Drop" 
    },
    image: { 
        type: String, 
        default: "" 
    },
    price: { 
        type: Number, 
        default: 0 
    },
    color: { 
        type: String, 
        default: "" 
    },
    size: { 
        type: String, 
        default: "" 
    },
    quantity: { 
        type: Number, 
        required: true, 
        default: 1, 
        min: 1 
    },
    maxStock: { 
        type: Number, 
        default: 99 
    }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    items: [cartItemSchema]
}, { timestamps: true });

// Prevent mongoose OverwriteModelError if recompiled
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;