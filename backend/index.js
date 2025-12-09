// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/userRoutes');
const phraseRoutes = require('./routes/phraseRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Pour dev, en prod tu peux mettre l'URL de ton front
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connexion à MongoDB Atlas
const DB_URI = process.env.DB_URI; // <- Assure-toi que Render a cette variable
if (!DB_URI) {
  console.error('❌ DB_URI non défini. Vérifie tes Environment Variables sur Render.');
  process.exit(1);
}

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // On arrête si la DB n’est pas connectée
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/phrases', phraseRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hassaniya2Arabic API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      users: '/api/users',
      phrases: '/api/phrases'
    }
  });
});

// Route de santé
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Gestion 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Accessible via Render`);
});

// Fermeture propre (optionnel sur Render)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed');
  process.exit(0);
});
