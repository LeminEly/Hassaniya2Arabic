const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hash du mot de passe manuellement
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret_fallback',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message 
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret_fallback',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      name: user.name,
      email: user.email,
      token,
    });
  }
   
  catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la connexion',
      error: error.message 
    });
  }
};

// Dans userController.js
exports.getProfile = async (req, res) => {
  try {
    // Implémentez la logique pour récupérer le profil
    res.json({ 
      message: 'Profil utilisateur',
      userId: req.userId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};