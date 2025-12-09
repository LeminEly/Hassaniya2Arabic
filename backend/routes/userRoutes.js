const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protégées - ASSUREZ-VOUS que userController.getProfile est une fonction
// Si vous n'avez pas cette fonction, supprimez cette ligne ou créez-la
router.get('/profile', auth, userController.getProfile);

module.exports = router;
