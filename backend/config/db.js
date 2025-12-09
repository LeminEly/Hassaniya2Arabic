const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Utiliser la variable d'environnement définie sur Render : DB_URI
    const conn = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Arrête le serveur si la connexion échoue
  }
};

module.exports = connectDB;
