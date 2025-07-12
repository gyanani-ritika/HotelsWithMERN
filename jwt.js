const jwt = require('jsonwebtoken');

// Middleware to authenticate requests using JWT
const jwtAuthMiddleware = (req, res, next) => {

    // Check if the request has an Authorization header
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Token not found ' });
    }

    //extract jwt token from request headers
    const token = req.headers.authorization?.split(' ')[1]; // token is in the format "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        //verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded contains the user information
        req.user = decoded; // attach the decoded user info to the request object
        next(); // call the next middleware or route handler
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}

// Function to generate a new JWT token using user data
const generateToken = (userData) => {
    return jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { jwtAuthMiddleware, generateToken };