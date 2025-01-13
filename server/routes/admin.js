const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adminMiddleware = require('../middleware/adminMiddleware'); // Import the admin check middleware

/**
 * Add a new plant (only accessible by admin)
 */
router.post('/add-plant', adminMiddleware, async (req, res) => {
  const { name, genus, species, imageUrl, pColor, sColor } = req.body;

  console.log('Received plant data:', req.body);

  if (!name || !genus || !species || !imageUrl || !pColor || !sColor) {
    console.error('Missing plant details');
    return res.status(400).json({ error: 'Please provide all plant details' });
  }

  try {
    const newPlant = await prisma.plant.create({
      data: { name, genus, species, imageUrl, pColor, sColor },
    });

    console.log('Plant added successfully:', newPlant);
    res.status(201).json({ message: 'Plant added successfully', plant: newPlant });
  } catch (error) {
    console.error('Error adding plant:', error);
    res.status(500).json({ error: 'Failed to add plant' });
  }
});

/**
 * Ban a user (only accessible by admin)
 */
router.post('/ban-user', adminMiddleware, async (req, res) => {
  const { userId } = req.body;

  console.log('Received ban request for user ID:', userId);

  if (!userId) {
    console.error('User ID not provided');
    return res.status(400).json({ error: 'Please provide user ID' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);

    await prisma.user.update({
      where: { id: userId },
      data: { banned: true },
    });

    console.log('User banned successfully:', userId);
    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

/**
 * Promote a user to admin (only accessible by admin)
 */
router.post('/promote-user', adminMiddleware, async (req, res) => {
  const { userId } = req.body;

  console.log('Received promote request for user ID:', userId);

  if (!userId) {
    console.error('User ID not provided');
    return res.status(400).json({ error: 'Please provide user ID' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found for promotion:', user);

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' },
    });

    console.log('User promoted to admin successfully:', userId);
    res.status(200).json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Failed to promote user to admin' });
  }
});

/**
 * Update user details (only accessible by admin)
 */
router.put('/users/:id', adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  console.log(`Updating user with ID: ${id}, New Role: ${role}`);

  if (!role || !['admin', 'user'].includes(role)) {
    console.error('Invalid or missing role');
    return res.status(400).json({ error: 'Invalid or missing role' });
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });

    console.log('User updated successfully:', user);
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
