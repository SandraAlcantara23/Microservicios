const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rutasUsuario = require('./routes/auth.route.js');

const app = express();

app.use(cors());
app.use(express.json());

// Tus rutas
app.use('/api/users', rutasUsuario);

app.get("/", (req, res) => res.json({ message: "Hola Mundo" }));

// ✅ En Docker: host = "mongodb" (nombre del servicio en docker-compose)
// ✅ authSource=admin porque el usuario root vive en la DB admin
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:1234@mongodb:27017/admin?authSource=admin';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor iniciado en el puerto ${PORT}`);
      console.log(`Mongo URI: ${MONGO_URI}`);
    });
  })
  .catch((err) => {
    console.log('Error al conectar a MongoDB: ' + err);
  });