const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('./auth');

// Route for adding a new plant
router.post('/', authenticateToken, async (req, res) => {
  const { cName, sName, care } = req.body;

  // Simple validation
  if (!cName || !sName || !care) {
    return res.status(400).json({ error: 'Please provide all required fields: cName, sName, care' });
  }

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
    if (error.code === 'P2002' && error.meta.target.includes('Plant_cName_key')) {
      res.status(400).json({ error: 'A plant with this common name already exists' });
    } else if (error.code === 'P2002' && error.meta.target.includes('Plant_sName_key')) {
      res.status(400).json({ error: 'A plant with this scientific name already exists' });
    } else {
      console.error('Error adding plant:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
});

// Route for getting all plants or a specific plant by ID
router.get('/:id?', async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const plant = await prisma.plant.findUnique({
        where: { id: parseInt(id) },
      });

      if (!plant) {
        return res.status(404).json({ error: 'Plant not found' });
      }

      res.status(200).json(plant);
    } else {
      const plants = await prisma.plant.findMany();
      res.status(200).json(plants);
    }
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for updating a plant by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { cName, sName, care } = req.body;

  // Simple validation
  if (!cName || !sName || !care) {
    return res.status(400).json({ error: 'Please provide all required fields: cName, sName, care' });
  }

  try {
    const updatedPlant = await prisma.plant.update({
      where: { id: parseInt(id) },
      data: {
        cName,
        sName,
        care,
      },
    });

    res.status(200).json({ message: 'Plant updated successfully', plant: updatedPlant });
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('Plant_cName_key')) {
      res.status(400).json({ error: 'A plant with this common name already exists' });
    } else if (error.code === 'P2002' && error.meta.target.includes('Plant_sName_key')) {
      res.status(400).json({ error: 'A plant with this scientific name already exists' });
    } else {
      console.error('Error updating plant:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
});

// Route for deleting a plant by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.plant.delete({
      where: { id: parseInt(id) },
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