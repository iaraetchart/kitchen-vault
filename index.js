import express from "express";
import dotenv from "dotenv";
import router from "./routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Global Middlewares
app.use(express.json()); // To handle JSON data
app.use(express.urlencoded({ extended: true })); // For URL-encoded form data

// Routes
app.use("/", router);

// Global middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});