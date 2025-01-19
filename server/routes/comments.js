const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all comments (filtered by userId if provided)
router.get('/', async (req, res) => {
  const { userId } = req.query; // Extract userId from query string

  try {
    let comments;
    if (userId) {
      // If userId is provided, filter comments by userId
      comments = await prisma.comment.findMany({
        where: {
          userId: parseInt(userId, 10), // Ensure the userId is parsed as an integer
        },
      });
    } else {
      // Otherwise, return all comments
      comments = await prisma.comment.findMany();
    }
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});


// Create a comment
router.post('/', async (req, res) => {
  const { content, userId, reviewId } = req.body;

  if (!content || !userId || !reviewId) {
    return res.status(400).json({ error: 'Content, userId, and reviewId are required' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        reviewId,
      },
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update a comment by commentId
router.put('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required to update the comment' });
  }

  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId, 10) },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});


// Delete a comment by commentId
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Delete all comments associated with a specific reviewId
router.delete('/byReviewId/:reviewId', async (req, res) => {
  const { reviewId } = req.params;

  try {
    // Check if there are any comments associated with this reviewId
    const comments = await prisma.comment.findMany({
      where: { reviewId: parseInt(reviewId) },
    });

    if (comments.length === 0) {
      return res.status(404).json({ error: 'No comments found for this review' });
    }

    // Delete all comments with the specified reviewId
    await prisma.comment.deleteMany({
      where: { reviewId: parseInt(reviewId) },
    });

    res.status(200).json({ message: 'Comments deleted successfully' });
  } catch (err) {
    console.error('Error deleting comments:', err);
    res.status(500).json({ error: 'Failed to delete comments' });
  }
});

module.exports = router;
