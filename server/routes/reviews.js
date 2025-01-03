const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all reviews, with optional filtering by plantId
router.get('/', async (req, res) => {
  const { plantId } = req.query;
  
  try {
    let reviews;
    if (plantId) {
      // Filter reviews by plantId if provided
      reviews = await prisma.review.findMany({
        where: {
          plantId: parseInt(plantId, 10), // Make sure to parse it as an integer
        },
      });
    } else {
      // Return all reviews if no plantId is specified
      reviews = await prisma.review.findMany();
    }
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create a review
router.post('/', async (req, res) => {
  const { content, rating, userId, plantId } = req.body;
  try {
    const newReview = await prisma.review.create({
      data: {
        content,
        rating,
        userId,
        plantId,
      },
    });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Delete a review by reviewId and plantId
router.delete('/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { plantId } = req.body; // Or you could use query params: req.query.plantId
  
  try {
    // Find the review to ensure it belongs to the correct plantId
    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId, 10) },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.plantId !== parseInt(plantId, 10)) {
      return res.status(400).json({ error: 'Review does not belong to the specified plant' });
    }

    // Proceed to delete the review if it belongs to the correct plantId
    await prisma.review.delete({
      where: { id: parseInt(reviewId, 10) },
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});


module.exports = router;
