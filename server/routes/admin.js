const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adminMiddleware = require('../middleware/adminMiddleware'); // Import the admin check middleware

// Add a new plant (only accessible by admin)
router.post('/add-plant', adminMiddleware, async (req, res) => {
  const { name, genus, species, imageUrl, pColor, sColor } = req.body;

  if (!name || !genus || !species || !imageUrl || !pColor || !sColor) {
    return res.status(400).json({ error: 'Please provide all plant details' });
  }

  try {
    const newPlant = await prisma.plant.create({
      data: {
        name,
        genus,
        species,
        imageUrl,
        pColor,
        sColor,
      },
    });

    res.status(201).json({ message: 'Plant added successfully', plant: newPlant });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add plant' });
  }
});

// Ban a user (only accessible by admin)
router.post('/ban-user', adminMiddleware, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Please provide user ID' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user as banned
    await prisma.user.update({
      where: { id: userId },
      data: { banned: true }, // Set banned to true
    });

    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Promote a user to admin (only accessible by admin)
router.post('/promote-user', adminMiddleware, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Please provide user ID' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Promote the user to admin
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' }, // Change role to admin
    });

    res.status(200).json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote user to admin' });
  }
});

module.exports = router;
