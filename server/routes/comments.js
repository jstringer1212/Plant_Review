const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create a comment
router.post('/', async (req, res) => {
  const { content, userId, plantId } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        plantId,
      },
    });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Delete a comment by commentId
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    // Find the comment by commentId
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the user is authorized to delete this comment (check userId match)
    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    // Proceed to delete the comment
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
