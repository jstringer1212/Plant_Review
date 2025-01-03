const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all favorites
router.get('/', async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany();
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add a favorite
router.post('/', async (req, res) => {
  const { userId, plantId, isFavorite } = req.body;
  console.log('Received data:', { userId, plantId, isFavorite });

  // Validate inputs
  if (!userId || !plantId || typeof isFavorite === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userIdInt = parseInt(userId, 10); // Convert userId to integer
    if (isNaN(userIdInt)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    console.log('User ID (converted):', userIdInt);

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
        // Trying to unfavorite (remove)
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
        // Trying to add a favorite that already exists
        return res.status(400).json({ error: 'Favorite already exists' });
      }
    } else {
      // If the favorite doesn't exist
      if (isFavorite) {
        // Trying to add a new favorite
        const newFavorite = await prisma.favorite.create({
          data: {
            userId: userIdInt,
            plantId,
            isFavorite,
          },
        });
        return res.status(201).json(newFavorite);
      } else {
        // Trying to unfavorite but it doesn't exist
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
  console.log('Received data:', { userId, plantId });

  // Validate inputs
  if (!userId || !plantId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userIdInt = parseInt(userId, 10); // Convert userId to integer
    if (isNaN(userIdInt)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    console.log('User ID (converted):', userIdInt);

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_plantId: {
          userId: userIdInt,
          plantId,
        },
      },
    });

    if (existingFavorite) {
      // If the favorite exists, delete it
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
