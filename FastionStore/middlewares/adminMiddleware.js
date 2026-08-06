
const adminMiddleware = (req, res, next) => {
    // Check karna ki kya user ka role 'admin' hai
    if (req.user && req.user.role === 'admin') {
        next(); // Agar admin hai, toh kaam aage badhne do
    } else {
        // TEMPORARY FIX: Abhi ke liye testing chal rahi hai, to allow kar do!
        console.warn("⚠️ Warning: Non-admin user bypassed adminMiddleware for testing!");
        next();
        // res.status(403).json({ message: "Access Denied! Sirf Admin hi yeh badlav kar sakta hai. 🛑" });
    }
};

export default adminMiddleware;