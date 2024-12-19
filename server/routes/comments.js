// comments.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, authorizeAdmin } = require('./auth');

// Route for adding a new comment
router.post('/', authenticateToken, async (req, res) => {
  const { userId, reviewId, content } = req.body;

  // Simple validation
  if (!userId || !reviewId || !content) {
    return res.status(400).json({ error: 'Please provide all required fields: userId, reviewId, content' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        userId,
        reviewId,
        content,
      },
    });

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for getting all comments or a specific comment by ID
router.get('/:id?', async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(id) },
      });

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.status(200).json(comment);
    } else {
      const comments = await prisma.comment.findMany();
      res.status(200).json(comments);
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Route for deleting a comment by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    // Find the comment by ID
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the authenticated user is the owner of the comment or an admin
    if (comment.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You can only delete your own comments.' });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
