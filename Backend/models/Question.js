const mongoose = require('mongoose');

// backend/models/Question.js ke andar schema main ye add karo:
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  
  // YE NAYI LINE ADD KARO 👇
  section: { type: String, enum: ['Theory', 'Practical'] },
  
  tags: [{ type: String, required: true }],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  questionText: { type: String, required: true },
  solutionMarkdown: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Question', questionSchema);