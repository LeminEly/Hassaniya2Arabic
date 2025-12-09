const Phrase = require('../models/Phrase');
const User = require('../models/User');

// Récupérer TOUTES les phrases
exports.getAllPhrases = async (req, res) => {
  try {
    const phrases = await Phrase.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .select('hassaniya arabic createdAt updatedAt user');

    res.json(phrases);
  } catch (error) {
    console.error('Erreur récupération phrases:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération',
      error: error.message 
    });
  }
};

// Récupérer les phrases de l'utilisateur
exports.getUserPhrases = async (req, res) => {
  try {
    const userId = req.userId;

    const phrases = await Phrase.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(phrases);
  } catch (error) {
    console.error('Erreur récupération phrases:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération',
      error: error.message 
    });
  }
};

// Créer une phrase
exports.createPhrase = async (req, res) => {
  try {
    const { hassaniya, arabic } = req.body;
    const userId = req.userId;

    if (!hassaniya || !arabic) {
      return res.status(400).json({ message: 'Les deux champs sont obligatoires' });
    }

    const phrase = await Phrase.create({
      hassaniya,
      arabic,
      user: userId,
    });

    const populatedPhrase = await Phrase.findById(phrase._id)
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Phrase créée avec succès',
      phrase: populatedPhrase,
    });
  } catch (error) {
    console.error('Erreur création phrase:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la création',
      error: error.message 
    });
  }
};

// Récupérer une phrase spécifique (AJOUTEZ CETTE FONCTION SI MANQUANTE)
exports.getPhraseById = async (req, res) => {
  try {
    const { id } = req.params;

    const phrase = await Phrase.findById(id)
      .populate('user', 'name email');

    if (!phrase) {
      return res.status(404).json({ message: 'Phrase non trouvée' });
    }

    res.json(phrase);
  } catch (error) {
    console.error('Erreur récupération phrase:', error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};

// Mettre à jour une phrase
exports.updatePhrase = async (req, res) => {
  try {
    const { id } = req.params;
    const { hassaniya, arabic } = req.body;
    const userId = req.userId;

    const phrase = await Phrase.findOneAndUpdate(
      { _id: id, user: userId },
      { hassaniya, arabic },
      { new: true }
    );

    if (!phrase) {
      return res.status(404).json({ message: 'Phrase non trouvée ou non autorisée' });
    }

    res.json({
      message: 'Phrase mise à jour avec succès',
      phrase,
    });
  } catch (error) {
    console.error('Erreur mise à jour phrase:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la mise à jour',
      error: error.message 
    });
  }
};

// Supprimer une phrase
exports.deletePhrase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const phrase = await Phrase.findOneAndDelete({ 
      _id: id, 
      user: userId 
    });

    if (!phrase) {
      return res.status(404).json({ message: 'Phrase non trouvée ou non autorisée' });
    }

    res.json({
      message: 'Phrase supprimée avec succès',
      deletedId: id,
    });
  } catch (error) {
    console.error('Erreur suppression phrase:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression',
      error: error.message 
    });
  }
};
