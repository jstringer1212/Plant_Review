// plants.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example route for getting all plants
router.get('/', (req, res) => {
  res.send('Getting all plants');
});

// Route for adding a new plant
router.post('/', async (req, res) => {
  const { cName, sName, care } = req.body;

  try {
    const newPlant = await prisma.plant.create({
      data: {
        cName,
        sName,
        care,
      },
    });

    res.status(201).json({ message: 'Plant added successfully', plant: newPlant });
  } catch (error) {
    console.error('Error adding plant:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// You can add more plant-related routes here

module.exports = router;
