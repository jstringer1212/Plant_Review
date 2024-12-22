const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('./auth');

// Route for searching plants dynamically (no authentication required)
router.get('/search', async (req, res) => {
  const { cName, genus, species, color } = req.query;
  console.log('Search payload:', { cName, genus, species, color }); // Log the search parameters
  try {
    const plants = await prisma.plant.findMany({
      where: {
        AND: [
          cName ? { cName: { contains: cName, mode: 'insensitive' } } : {},
          genus ? { genus: { contains: genus, mode: 'insensitive' } } : {},
          species ? { species: { contains: species, mode: 'insensitive' } } : {},
          color ? {
            OR: [
              { pColor: { contains: color, mode: 'insensitive' } },
              { sColor: { contains: color, mode: 'insensitive' } },
            ],
          } : {},
        ],
      },
    });
    console.log('Search results:', plants); // Log the search results
    res.status(200).json(plants);
  } catch (error) {
    console.error('Error searching plants:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for getting all plants (no authentication required)
router.get('/', async (req, res) => {
  console.log('Fetching plants in routes...');
  try {
    const plants = await prisma.plant.findMany();
    res.status(200).json(plants); // Ensure the response is JSON
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for getting a specific plant by ID (no authentication required)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Fetching plant by ID:', id); // Log the ID being passed
  try {
    const plantId = parseInt(id); // Ensure the id is parsed as an integer
    const plant = await prisma.plant.findUnique({
      where: { id: plantId },
    });
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.status(200).json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for adding a new plant (no authentication required)
router.post('/', async (req, res) => {
  const { cName, sName, genus, species, care, pColor, sColor, imageUrl } = req.body;

  // Simple validation
  if (!cName || !sName || !genus || !species || !care || !imageUrl) {
    return res.status(400).json({ error: 'Please provide all required fields: cName, sName, genus, species, care, imageUrl' });
  }

  try {
    const newPlant = await prisma.plant.create({
      data: {
        cName,
        sName,
        genus,
        species,
        care,
        pColor,
        sColor,
        imageUrl,
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

// Route for updating a plant by ID (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { cName, sName, genus, species, care, pColor, sColor, imageUrl } = req.body;

  // Simple validation
  if (!cName || !sName || !genus || !species || !care || !imageUrl) {
    return res.status(400).json({ error: 'Please provide all required fields: cName, sName, genus, species, care, imageUrl' });
  }

  console.log('Updating plant by ID:', id); // Log the ID being passed
  try {
    const plantId = parseInt(id); // Ensure the id is parsed as an integer
    const updatedPlant = await prisma.plant.update({
      where: { id: plantId },
      data: {
        cName,
        sName,
        genus,
        species,
        care,
        pColor,
        sColor,
        imageUrl,
      },
    });
    res.status(200).json({ message: 'Plant updated successfully', plant: updatedPlant });
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for deleting a plant by ID (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  console.log('Deleting plant by ID:', id); // Log the ID being passed
  try {
    const plantId = parseInt(id); // Ensure the id is parsed as an integer
    await prisma.plant.delete({
      where: { id: plantId },
    });
    res.status(200).json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;