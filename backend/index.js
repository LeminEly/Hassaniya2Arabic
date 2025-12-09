const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importer les routes
const userRoutes = require('./routes/userRoutes');
const phraseRoutes = require('./routes/phraseRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Pour le développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // pour parser le JSON des requêtes

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hassaniya-arabic')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Le serveur démarre sans base de données (mode test)');
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

// CORRECTION ICI : Ne pas utiliser app.use('*', ...)
// À la place, pour gérer les routes 404 :
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

// Vérifier la connexion DB mais démarrer quand même
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connection established');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
});

// Gestion de la fermeture
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed');
  process.exit(0);
});