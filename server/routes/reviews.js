// reviews.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('./auth');

// Example route for getting all reviews
router.get('/', (req, res) => {
  res.send('Getting all reviews');
});

// Route for adding a new review
router.post('/', authenticateToken, async (req, res) => {
  const { userId, plantId, rating, content } = req.body;

  // Simple validation
  if (!userId || !plantId || !rating || !content) {
    return res.status(400).json({ error: 'Please provide all required fields: userId, plantId, rating, content' });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        userId,
        plantId,
        rating,
        content,
      },
    });

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for getting all reviews or a specific review by ID
router.get('/:id?', async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const review = await prisma.review.findUnique({
        where: { id: parseInt(id) },
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.status(200).json(review);
    } else {
      const reviews = await prisma.review.findMany();
      res.status(200).json(reviews);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
