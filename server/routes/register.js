// register.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating a JWT
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route for registering a new user
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields: firstName, lastName, email, password' });
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error creating user:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected
  }
});

module.exports = router;
