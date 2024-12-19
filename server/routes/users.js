const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, authorizeAdmin } = require('./auth');

// Route for getting all users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for getting a specific user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for creating a new user
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields: firstName, lastName, email, password' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        role: role || 'user', // Default to 'user' if role is not provided
      },
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('User_email_key')) {
      res.status(400).json({ error: 'A user with this email already exists' });
    } else {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
});

// Route for updating a user by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, role } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields: firstName, lastName, email, password' });
  }

  // Ensure the user can only update their own account or an admin can update any account
  if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. You can only update your own account.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        email,
        password,
        role,
      },
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('User_email_key')) {
      res.status(400).json({ error: 'A user with this email already exists' });
    } else {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
});

// Route for deleting a user by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Ensure the user can only delete their own account or an admin can delete any account
  if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. You can only delete your own account.' });
  }

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
