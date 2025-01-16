const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function for input validation
function validateFavoriteInput(data) {
  const errors = [];

  if (!data.userId) {
    errors.push('User ID is required.');
  } else if (isNaN(parseInt(data.userId, 10))) {
    errors.push('User ID must be a valid number.');
  }

  if (!data.plantId) {
    errors.push('Plant ID is required.');
  }

  if (typeof data.isFavorite === 'undefined') {
    errors.push('isFavorite field is required.');
  } else if (typeof data.isFavorite !== 'boolean') {
    errors.push('isFavorite must be a boolean value.');
  }

  return errors;
}

// Get all favorites (filtered by userId if provided)
router.get('/', async (req, res) => {
  const { userId } = req.query; // Extract userId from query string

  try {
    let favorites;
    if (userId) {
      // If userId is provided, filter favorites by userId
      favorites = await prisma.favorite.findMany({
        where: {
          userId: parseInt(userId, 10), // Make sure to parse it as an integer
        },
      });
    } else {
      // Otherwise, return all favorites
      favorites = await prisma.favorite.findMany();
    }
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});


// Add or remove a favorite
router.post('/', async (req, res) => {
  const { userId, plantId, isFavorite } = req.body;

  // Validate inputs
  const validationErrors = validateFavoriteInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const userIdInt = parseInt(userId, 10); // Convert userId to integer

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_plantId: {
          userId: userIdInt,
          plantId,
        },
      },
    });

    if (existingFavorite) {
      // If the favorite already exists
      if (!isFavorite) {
        // Remove favorite
        await prisma.favorite.delete({
          where: {
            userId_plantId: {
              userId: userIdInt,
              plantId,
            },
          },
        });
        return res.status(200).json({ message: 'Favorite removed' });
      } else {
        // Favorite already exists and is being re-added
        return res.status(400).json({ error: 'Favorite already exists' });
      }
    } else {
      // If the favorite doesn't exist
      if (isFavorite) {
        // Add a new favorite
        const newFavorite = await prisma.favorite.create({
          data: {
            userId: userIdInt,
            plantId,
            isFavorite,
          },
        });
        return res.status(201).json(newFavorite);
      } else {
        // Trying to unfavorite a non-existent favorite
        return res.status(400).json({ error: 'Favorite does not exist to remove' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add or remove favorite' });
  }
});

// Delete a favorite
router.delete('/', async (req, res) => {
  const { userId, plantId } = req.body;

  // Validate inputs
  const errors = [];
  if (!userId) errors.push('User ID is required.');
  if (!plantId) errors.push('Plant ID is required.');
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const userIdInt = parseInt(userId, 10); // Convert userId to integer

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_plantId: {
          userId: userIdInt,
          plantId,
        },
      },
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          userId_plantId: {
            userId: userIdInt,
            plantId,
          },
        },
      });
      return res.status(200).json({ message: 'Favorite removed' });
    } else {
      return res.status(400).json({ error: 'Favorite does not exist to remove' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
