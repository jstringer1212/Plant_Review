const jwt = require('jsonwebtoken'); // Ensure jwt is imported
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminMiddleware = async (req, res, next) => {
  console.log('adminMiddleware hit'); // Log middleware activation

  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    console.log('No token provided'); // Log if no token is provided
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify the token
    console.log('Decoded user:', decoded); // Log decoded token data

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.log('User not found in database:', decoded.id); // Log if user is not found
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'admin') {
      console.log('Access denied for user:', user.id); // Log if the user is not an admin
      return res.status(403).json({ error: 'Access denied L21' });
    }

    req.user = user; // Attach user to the request object for downstream use
    console.log('Admin access granted for user:', user.id); // Log successful admin access
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log('Error verifying token:', error.message); // Log token verification errors
    return res.status(500).json({ error: 'Failed to authenticate token' });
  }
};

module.exports = adminMiddleware;
