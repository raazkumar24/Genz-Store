import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // 1. Request ke headers se token nikalna (Bearer Token format)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // TEMPORARY FIX FOR DEV
        console.warn("⚠️ Warning: No Bearer header, bypassing auth for dev!");
        req.user = { id: 'dev_user', role: 'admin' };
        return next();
        // return res.status(401).json({ message: "Access Denied! Token nahi mila. 🔒" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // TEMPORARY FIX FOR DEV: Agar token 'null' ya empty hai, toh dummy user pass kardo
        if (!token || token === 'null' || token === '') {
            console.warn("⚠️ Warning: No valid token, bypassing auth for dev!");
            req.user = { id: 'dev_user', role: 'admin' };
            return next();
        }

        // 2. Token ko verify karna
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. User ka data (id aur role) request object me daalna
        req.user = verified; 
        
        next(); // Agle step ya middleware par bhejna
    } catch (error) {
        console.warn("⚠️ Token verification failed, bypassing auth for dev!");
        req.user = { id: 'dev_user', role: 'admin' };
        next();
        // res.status(403).json({ message: "Invalid ya Expired Token! ❌" });
    }
};

export default authMiddleware;