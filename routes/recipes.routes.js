import express from 'express';

const router = express.Router();

// Datos en memoria
let recipes = [
  { id: 1, name: 'Tarta de manzana', description: 'Una deliciosa tarta de manzana casera' },
  { id: 2, name: 'Ensalada César', description: 'Ensalada fresca con pollo y aderezo César' },
];

// Obtener todas las recetas
router.get('/', (req, res) => {
  res.json(recipes);
});

// Crear una nueva receta
router.post('/', (req, res) => {
  const { name, description } = req.body;
  const newRecipe = { id: recipes.length + 1, name, description };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// Obtener una receta por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const recipe = recipes.find((r) => r.id === parseInt(id));
  if (!recipe) return res.status(404).json({ message: 'Receta no encontrada' });
  res.json(recipe);
});

// Actualizar una receta por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const recipe = recipes.find((r) => r.id === parseInt(id));
  if (!recipe) return res.status(404).json({ message: 'Receta no encontrada' });

  recipe.name = name || recipe.name;
  recipe.description = description || recipe.description;
  res.json(recipe);
});

// Eliminar una receta por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = recipes.findIndex((r) => r.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Receta no encontrada' });

  recipes.splice(index, 1);
  res.status(204).send(); // No devuelve contenido
});

export default router;