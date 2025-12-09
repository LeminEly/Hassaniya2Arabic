// routes/phraseRoutes.js - CE FICHIER EST MAUVAIS
// Vous avez copié le code de auth.js ici !

// REMPLACEZ-LE PAR :
const express = require('express');
const router = express.Router();
const phraseController = require('../controllers/phraseController');
const auth = require('../middleware/auth');

// Route publique - accessible sans authentification
router.get('/public', phraseController.getAllPhrases);

// Toutes les routes suivantes nécessitent une authentification
router.use(auth);

// Routes CRUD pour les phrases
router.post('/', phraseController.createPhrase);
router.get('/', phraseController.getAllPhrases); // ou getUserPhrases si vous voulez séparer
router.get('/:id', phraseController.getPhraseById);
router.put('/:id', phraseController.updatePhrase);
router.delete('/:id', phraseController.deletePhrase);

module.exports = router;