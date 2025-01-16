const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all reviews, with optional filtering by plantId and userId
router.get('/', async (req, res) => {
  const { plantId, userId } = req.query;
  
  try {
    let reviews;
    const filters = {};

    if (userId) {
      filters.userId = parseInt(userId, 10); // Filter by userId if provided
    }
    if (plantId) {
      filters.plantId = parseInt(plantId, 10); // Filter by plantId if provided
    }

    // Fetch reviews based on filters
    reviews = await prisma.review.findMany({
      where: filters,
    });

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
  const { plantId, userId, role } = req.body; // Accept role directly
  console.log('review id: ', reviewId);

  try {
    // Find the review
    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId, 10) },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if the review belongs to the correct plant
    if (review.plantId !== parseInt(plantId, 10)) {
      return res.status(400).json({ error: 'Review does not belong to the specified plant' });
    }

    // Check if the user is authorized to delete (owner or admin)
    if (review.userId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this review' });
    }

    // Proceed to delete the review
    await prisma.review.delete({
      where: { id: parseInt(reviewId, 10) },
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});



module.exports = router;
