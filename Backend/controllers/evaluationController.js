const Evaluation = require('../models/Evaluation'); // Upar model import karna zaroori hai

// 1. =========================================
// 🟢 CHANGES: Admin ko data dikhane ke liye 'user: req.user.id' hata diya
// =========================================
const getSingleCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sirf ID se search karo, taki Admin kisi ka bhi result dekh sake
    const candidateData = await Evaluation.findById(id);
    
    if (!candidateData) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    
    // Vercel Cache Fix (Yeh tumhara code sahi tha)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(candidateData);
  } catch (error) {
    console.error("Error fetching single candidate:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. =========================================
// 🟢 CHANGES: Admin Dashboard par sabka data laane ke liye req.user.id hataya
// =========================================
const getEvaluations = async (req, res) => {
  try {
    // Admin ko table mein sabhi candidates dekhne hain, isliye khali find()
    const data = await Evaluation.find(); 
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. =========================================
// 🟢 NAYA ADD KIYA: Duplicate ID wala bug theek karne ke liye (Upsert Logic)
// =========================================
const saveEvaluation = async (req, res) => {
  try {
    const { moduleName, userAnswers, scores, attempts, history } = req.body;
    
    // Agar tumhara schema 'candidateId' use karta hai, toh 'user:' ki jagah 'candidateId:' likhna
    const userId = req.user.id; 

    // findOneAndUpdate + upsert: true => Agar pehle se entry hai toh update karega, warna nayi banayega
    const updatedEvaluation = await Evaluation.findOneAndUpdate(
      { user: userId, moduleName: moduleName }, 
      { 
        $set: { 
          userAnswers, 
          scores, 
          attempts, 
          history, 
          updatedAt: Date.now() 
        } 
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: updatedEvaluation });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: "Save fail ho gaya" });
  }
};

module.exports = {
  getSingleCandidate,
  getEvaluations,
  saveEvaluation
};
























// const getSingleCandidate = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const candidateData = await Evaluation.findOne({ _id: id, user: req.user.id });
    
//     if (!candidateData) {
//       return res.status(404).json({ message: "Candidate not found or unauthorized access" });
//     }
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     res.status(200).json(candidateData);
//   } catch (error) {
//     console.error("Error fetching single candidate:", error);
//     res.status(500).json({ message: "Server error while fetching candidate data" });
//   }
// };

// // Example: If your function gets all evaluations for the dashboard
// const getEvaluations = async (req, res) => {
//   try {
//     const data = await Evaluation.find({ user: req.user.id }); 

//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Don't forget to export it at the bottom!
// module.exports = {
//   // ... your other exported functions,
//   getSingleCandidate
// };









// // Add this function inside your evaluationController.js file

// // const getSingleCandidate = async (req, res) => {
// //   try {
// //     const { id } = req.params;
    
// //     // Assuming your model is named Evaluation (matching BACKEND/models/Evaluation.js)
// //     const candidateData = await Evaluation.findById(id);
    
// //     if (!candidateData) {
// //       return res.status(404).json({ message: "Candidate not found" });
// //     }
    
// //     res.status(200).json(candidateData);
// //   } catch (error) {
// //     console.error("Error fetching single candidate:", error);
// //     res.status(500).json({ message: "Server error while fetching candidate data" });
// //   }
// // };

// const getSingleCandidate = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // 🔥 FIX 1: SECURITY & DATA LEAK FIX
//     // We are using 'findOne' instead of 'findById'. 
//     // This forces the database to ONLY return the data if it belongs to the logged-in user's ID.
//     // Note: If your schema uses 'userId' instead of 'user', change it below.
//     const candidateData = await Evaluation.findOne({ _id: id, user: req.user.id });
    
//     if (!candidateData) {
//       return res.status(404).json({ message: "Candidate not found or unauthorized access" });
//     }
    
//     // 🔥 FIX 2: VERCEL CACHE FIX
//     // This stops Vercel from remembering User 1's data and showing it to User 2.
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     res.status(200).json(candidateData);
//   } catch (error) {
//     console.error("Error fetching single candidate:", error);
//     res.status(500).json({ message: "Server error while fetching candidate data" });
//   }
// };

// // Example: If your function gets all evaluations for the dashboard
// const getEvaluations = async (req, res) => {
//   try {
//     // ❌ BAD: This returns User 1's data to everyone!
//     // const data = await Evaluation.find(); 

//     // ✅ GOOD: This forces the database to ONLY give data for the logged-in user
//     const data = await Evaluation.find({ user: req.user.id }); 

//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Don't forget to export it at the bottom!
// module.exports = {
//   // ... your other exported functions,
//   getSingleCandidate
// };