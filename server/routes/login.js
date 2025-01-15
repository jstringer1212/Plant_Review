const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is undefined!");
      return res.status(500).json({ error: 'Internal server error' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("Generated token:", token);

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error('Login error:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
