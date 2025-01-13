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
  const { content, userId, reviewId } = req.body;
  console.log("req body", req.body);
  // Validate required fields
  if (!content || !userId || !reviewId) {
    return res.status(400).json({ error: 'Content, userId, and reviewId are required' });
  }

  try {
    // Create a new comment
    const newComment = await prisma.comment.create({
      data: {
        content: content,
    userId: userId,  //returning undefined
    reviewId: reviewId,
      },
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err);
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
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
