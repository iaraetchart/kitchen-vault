import express from "express";
import Joi from "joi";
import recipes from "./recipes.js";

const router = express.Router();

// Data validation with Joi
const recipeSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.object().required(),
  instructions: Joi.string().required(),
  preparationTime: Joi.string().required(),
  vegetarian: Joi.string().valid("yes", "no").default("no"),
  vegan: Joi.string().valid("yes", "no").default("no"),
  difficulty: Joi.string().valid("easy", "medium", "hard").required(),
  portions: Joi.number().integer().min(1).default(1),
  calories: Joi.number().integer().min(0).default(0),
  image: Joi.string().uri().default("./img/default.jpg"),
  origin: Joi.string().default("unknown"),
});

const patchRecipeSchema = Joi.object({
  name: Joi.string().optional(),
  ingredients: Joi.object().optional(),
  instructions: Joi.string().optional(),
  preparationTime: Joi.string().optional(),
  vegetarian: Joi.string().valid("yes", "no").optional(),
  vegan: Joi.string().valid("yes", "no").optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
  portions: Joi.number().integer().min(1).optional(),
  calories: Joi.number().integer().min(0).optional(),
  image: Joi.string().uri().optional(),
  origin: Joi.string().optional()
});

// Route to obtain a random recipe
router.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * recipes.length);
  res.status(200).json(recipes[randomIndex]);
});

// Route to obtain a specific recipe by ID
router.get("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundRecipe = recipes.find((recipe) => recipe.id === id);

  if (!foundRecipe) {
    return res.status(404).json({ error: `Recipe with id ${id} not found.` });
  }

  res.status(200).json(foundRecipe);
});

// Route to filter recipes by dynamic parameters
router.get("/filter", (req, res) => {
  const filters = req.query;
  let filteredRecipes = recipes;

  Object.keys(filters).forEach((key) => {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe[key]?.toString().toLowerCase() === filters[key].toLowerCase()
    );
  });

  res.status(200).json(filteredRecipes);
});

// Route to add a new recipe
router.post("/recipes", (req, res) => {
  const { error, value } = recipeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newRecipe = {
    id: recipes.length + 1,
    ...value,
  };

  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// Route to completely replace a recipe by ID
router.put("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = recipes.findIndex((recipe) => recipe.id === id);

  if (searchIndex === -1) {
    return res.status(404).json({ error: `Recipe with id ${id} not found.` });
  }

  const { error, value } = recipeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const updatedRecipe = {
    id,
    ...value,
  };

  recipes[searchIndex] = updatedRecipe;
  res.status(200).json(updatedRecipe);
});

// Route to partially update a recipe by ID
router.patch("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingRecipe = recipes.find((recipe) => recipe.id === id);

  if (!existingRecipe) {
    return res.status(404).json({ error: `Recipe with id ${id} not found.` });
  }

  // Valida el cuerpo de la solicitud con Joi
  const { error, value } = patchRecipeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Actualiza solo los campos proporcionados
  const updatedRecipe = {
    ...existingRecipe,
    ...value
  };

  const searchIndex = recipes.findIndex((recipe) => recipe.id === id);
  recipes[searchIndex] = updatedRecipe;

  res.status(200).json(updatedRecipe);
});

// Route to delete a specific recipe by ID
router.delete("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = recipes.findIndex((recipe) => recipe.id === id);

  if (searchIndex > -1) {
    recipes.splice(searchIndex, 1);
    res.status(200).json({ message: `Recipe with id ${id} successfully deleted.` });
  } else {
    res.status(404).json({ error: `Recipe with id ${id} not found.` });
  }
});

// Route to delete all recipes
router.delete("/recipes", (req, res) => {
  const userKey = req.query.key;
  const masterKey = process.env.MASTERKEY;

  if (userKey === masterKey) {
    console.log(`All recipes deleted by user with key: ${userKey}`); // Audit
    recipes.length = 0;
    res.status(200).json({ message: "All recipes have been successfully deleted." });
  } else {
    res.status(403).json({ error: "You are not authorised to perform this action." });
  }
});

export default router;