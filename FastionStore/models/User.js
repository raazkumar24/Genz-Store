import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Unique email identifier
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'customer' } // Role: 'customer' | 'admin'
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;