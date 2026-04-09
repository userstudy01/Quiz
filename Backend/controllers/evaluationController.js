// Add this function inside your evaluationController.js file

const getSingleCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Assuming your model is named Evaluation (matching BACKEND/models/Evaluation.js)
    const candidateData = await Evaluation.findById(id);
    
    if (!candidateData) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    
    res.status(200).json(candidateData);
  } catch (error) {
    console.error("Error fetching single candidate:", error);
    res.status(500).json({ message: "Server error while fetching candidate data" });
  }
};

// Don't forget to export it at the bottom!
module.exports = {
  // ... your other exported functions,
  getSingleCandidate
};