const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/questions
// @desc    Get all questions (Candidates & Admins both can access)
// @access  Private (Needs login)
router.get('/', protect, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 }); // Latest pehle
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching questions' });
  }
});

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private & Admin Only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, tags, difficulty, questionText, solutionMarkdown } = req.body;

    const newQuestion = new Question({
      title,
      tags,
      difficulty,
      questionText,
      solutionMarkdown,
      createdBy: req.user.id // Token se admin ki ID mil jayegi
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating question' });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private & Admin Only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Update the document
    question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Return updated document
    );

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating question' });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private & Admin Only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.deleteOne();
    res.json({ message: 'Question removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting question' });
  }
});

module.exports = router;