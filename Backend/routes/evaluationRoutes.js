const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const { protect } = require('../middleware/authMiddleware');


// 1. Import the function from your controller
const { getSingleCandidate } = require('../controllers/evaluationController'); // Make sure this path matches your folder structure!

// Get ALL candidates for Admin Dashboard
// router.get('/admin/all', async (req, res) => {
//   try {
//     const allEvaluations = await Evaluation.find()
//       .populate('candidateId', 'name email'); 

//     // 🔥 CHANGE HERE: Changed 'eval' to 'evaluation'
//     const formattedData = allEvaluations.map(evaluation => {
//       // Safely extract the scores object
//       const scores = evaluation.scores || {};
      
//       return {
//         id: evaluation._id,
//         // 🔥 CHANGE HERE: Update all these to 'evaluation' too
//         name: evaluation.candidateId ? evaluation.candidateId.name : 'Unknown User',
//         email: evaluation.candidateId ? evaluation.candidateId.email : 'N/A',
//         practical: scores.practical || 0,
//         theory: scores.theory || 0
//       };
//     });

//     res.json(formattedData);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching admin data' });
//   }
// });

// Get ALL candidates for Admin Dashboard
// Get ALL candidates for Admin Dashboard
// Get ALL candidates for Admin Dashboard
router.get('/admin/all', async (req, res) => {
  try {
    // 🔥 THE FIX: Added .lean() to convert Mongoose data into pure, readable JSON
    const allEvaluations = await Evaluation.find()
      .populate('candidateId', 'name email')
      .lean(); 

    const formattedData = allEvaluations.map(evaluation => {
      let scores = evaluation.scores || {};
      let answers = evaluation.userAnswers || {};

      // 🔥 THE FIX: If their current test is blank, grab their most recent Past Session!
      if (Object.keys(answers).length === 0 && evaluation.history && evaluation.history.length > 0) {
        const latestArchive = evaluation.history[0];
        scores = latestArchive.savedScores || {};
        answers = latestArchive.savedAnswers || {};
      }
      
      // Safety calculation for totals
      let theoryTotal = scores.theory || 0;
      let practicalTotal = scores.practical || 0;

      if (theoryTotal === 0 && practicalTotal === 0) {
         Object.values(scores).forEach(item => {
            if (item && item.points) theoryTotal += item.points; 
         });
      }

      return {
        id: evaluation._id,
        name: evaluation.candidateId ? evaluation.candidateId.name : 'Unknown User',
        email: evaluation.candidateId ? evaluation.candidateId.email : 'N/A',
        practical: practicalTotal,
        theory: theoryTotal,
        rawScores: scores,
        userAnswers: answers
      };
    });

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admin data' });
  }
});

// Save progress automatically
// router.post('/save', protect, async (req, res) => {
//   try {
//     const { moduleName, userAnswers, scores, attempts, history } = req.body;
//     let evalData = await Evaluation.findOneAndUpdate(
//       { candidateId: req.user.id, moduleName },
//       { userAnswers, scores, attempts, history },
//       { new: true, upsert: true } // Agar nahi hai toh bana dega, hai toh update karega
//     );
//     res.json(evalData);
//   } catch (err) {
//     res.status(500).json({ message: 'Error saving progress' });
//   }
// });

// Save progress automatically
router.post('/save', protect, async (req, res) => {
  try {
    const { moduleName, userAnswers, scores, attempts, history } = req.body;
    
    let evalData = await Evaluation.findOne({ candidateId: req.user.id, moduleName });

    if (!evalData) {
      // Create new if it doesn't exist
      evalData = new Evaluation({
        candidateId: req.user.id,
        moduleName,
        userAnswers,
        scores,
        attempts,
        history
      });
    } else {
      // Update existing
      evalData.userAnswers = userAnswers;
      evalData.scores = scores;
      evalData.attempts = attempts;
      evalData.history = history;

      // 🔥 THIS IS THE EXACT FIX FOR MONGOOSE OBJECTS 🔥
      evalData.markModified('userAnswers');
      evalData.markModified('scores');
      evalData.markModified('attempts');
      evalData.markModified('history');
    }

    await evalData.save();
    res.json(evalData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving progress' });
  }
});


// Get SINGLE candidate details for Admin Review Page
// Get SINGLE candidate details for Admin Review Page
router.get('/admin/candidate/:id', async (req, res) => {
  console.log("🔥 HIT THE NEW ROUTE! Looking for ID:", req.params.id); // <--- DEBUG LOG
  
  try {
    const candidateId = req.params.id;
    
    const evaluation = await Evaluation.findById(candidateId)
      .populate('candidateId', 'name email')
      .lean();

    if (!evaluation) {
      console.log("❌ Evaluation not found in database!"); // <--- DEBUG LOG
      return res.status(404).json({ message: "Candidate evaluation not found" });
    }

    let scores = evaluation.scores || {};
    let answers = evaluation.userAnswers || {};

    if (Object.keys(answers).length === 0 && evaluation.history && evaluation.history.length > 0) {
      const latestArchive = evaluation.history[0];
      scores = latestArchive.savedScores || {};
      answers = latestArchive.savedAnswers || {};
    }

    let theoryTotal = scores.theory || 0;
    let practicalTotal = scores.practical || 0;

    const formattedData = {
      id: evaluation._id,
      name: evaluation.candidateId ? evaluation.candidateId.name : 'Unknown User',
      email: evaluation.candidateId ? evaluation.candidateId.email : 'N/A',
      practicalCount: practicalTotal, 
      theoryCount: theoryTotal,       
      userAnswers: answers,
      rawScores: scores,
      overallTheoryReview: evaluation.overallTheoryReview || null,
      overallPracticalReview: evaluation.overallPracticalReview || null
    };

    console.log("✅ Successfully found data, sending to frontend!"); // <--- DEBUG LOG
    res.json(formattedData);
  } catch (err) {
    console.error("❌ Error fetching single candidate:", err);
    res.status(500).json({ message: 'Error fetching candidate details' });
  }
});

module.exports = router;