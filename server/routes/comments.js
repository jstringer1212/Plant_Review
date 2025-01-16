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

module.exports = router;
