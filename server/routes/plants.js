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

// Add a Plant
router.post('/', async ( req, res) => {
  const { cName, sName, care, imageUrl,pColor, sColor, genus, species} = req.body;
  try {
    const newPlant = await prisma.plant.create({
      data: {
        cName,
        sName,
        care,
        imageUrl,
        pColor,
        sColor,
        genus,
        species
      },
    });
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(500).json({ error: 'failed to add plant' });
  }
});

// Update a Plant
router.put('/:id', async (req, res) => {
  const { id } = req.params; // The plant ID is provided in the URL
  const plantId = parseInt(id, 10); // Convert to an integer

  if (isNaN(plantId)) {
    return res.status(400).json({ error: 'Invalid plant ID. Must be an integer.' });
  }
  
  const { cName, sName, care, imageUrl, pColor, sColor, genus, species } = req.body;

  try {
    const updatedPlant = await prisma.plant.update({
      where: { id: parseInt(id) }, // Find the plant by its ID
      data: {
        cName,
        sName,
        care,
        imageUrl,
        pColor,
        sColor,
        genus,
        species,
      },
    });
    
    res.status(200).json(updatedPlant); // Return the updated plant data
  } catch (err) {
    console.error('Error updating plant:', err);
    res.status(500).json({ error: 'Failed to update plant' });
  }
});

// Delete a Plant
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // The plant ID is provided in the URL

  try {
    // First, check if the plant exists
    const plant = await prisma.plant.findUnique({
      where: { id: parseInt(id) },
    });

    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    // Delete the plant
    await prisma.plant.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Plant deleted successfully' });
  } catch (err) {
    console.error('Error deleting plant:', err);
    res.status(500).json({ error: 'Failed to delete plant' });
  }
});


module.exports = router;
