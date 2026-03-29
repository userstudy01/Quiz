const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const { protect } = require('../middleware/authMiddleware');

// Get progress for a specific module
router.get('/:moduleName', protect, async (req, res) => {
  try {
    let evalData = await Evaluation.findOne({ candidateId: req.user.id, moduleName: req.params.moduleName });
    if (!evalData) {
      // Naya user hai toh khali object bhej do
      evalData = new Evaluation({ candidateId: req.user.id, moduleName: req.params.moduleName });
      await evalData.save();
    }
    res.json(evalData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// Save progress automatically
router.post('/save', protect, async (req, res) => {
  try {
    const { moduleName, userAnswers, scores, attempts, history } = req.body;
    let evalData = await Evaluation.findOneAndUpdate(
      { candidateId: req.user.id, moduleName },
      { userAnswers, scores, attempts, history },
      { new: true, upsert: true } // Agar nahi hai toh bana dega, hai toh update karega
    );
    res.json(evalData);
  } catch (err) {
    res.status(500).json({ message: 'Error saving progress' });
  }
});

module.exports = router;