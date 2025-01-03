const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    const plants = await prisma.plant.findMany({
      where: {
        cName: {
          contains: query, // Search by common name
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// Get all plants  known good route
router.get('/', async (req, res) => {
  try {
    const plants = await prisma.plant.findMany();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// Get a specific plant by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const plant = await prisma.plant.findUnique({
      where: { id: Number(id) },
    });
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plant' });
  }
});

module.exports = router;
