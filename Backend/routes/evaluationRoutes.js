const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const { protect } = require('../middleware/authMiddleware');

// Get progress for a specific module
// 🔥 ADD THIS NEW ROUTE: Get ALL candidates for Admin Dashboard
router.get('/admin/all', async (req, res) => {
  try {
    // 1. Fetch all evaluations and populate the User's name and email
    const allEvaluations = await Evaluation.find()
      .populate('candidateId', 'name email'); 

    // 2. Format the data perfectly for your React table
    const formattedData = allEvaluations.map(eval => {
      return {
        id: eval._id,
        // Grab name/email from the populated User model (fallback to 'Unknown' if deleted)
        name: eval.candidateId ? eval.candidateId.name : 'Unknown User',
        email: eval.candidateId ? eval.candidateId.email : 'N/A',
        // Extract practical/theory from your scores object (default to 0)
        practical: eval.scores?.practical || 0,
        theory: eval.scores?.theory || 0
      };
    });

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admin data' });
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