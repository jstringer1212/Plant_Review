const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = user;  // Attach user to request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({ error: 'Failed to authenticate token' });
  }
};

module.exports = adminMiddleware;
