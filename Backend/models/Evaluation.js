const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleName: { type: String, required: true },
  userAnswers: { type: Object, default: {} },
  scores: { type: Object, default: {} },
  attempts: { type: Object, default: {} },
  history: { type: Array, default: [] } // Purani attempts save karne ke liye
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);