import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipesRoutes from './routes/recipes.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/recipes', recipesRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de recetas de cocina');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});