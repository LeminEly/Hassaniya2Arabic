// models/Phrase.js - Assurez-vous qu'il est correct
const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
  hassaniya: {
    type: String,
    required: [true, 'Le texte en Hassaniya est obligatoire'],
    trim: true,
  },
  arabic: {
    type: String,
    required: [true, 'La traduction arabe est obligatoire'],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Mettre à jour updatedAt
phraseSchema.pre('save', async function() {
  // Pas besoin de paramètre 'next' avec async
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Phrase', phraseSchema);