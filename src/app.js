require("dotenv").config(); // Load env vars

const express = require("express");
const bodyParser = require("body-parser"); // Or use express.json() below
const routes = require("./routes/index");
const { errorHandler, notFound } = require("./middleware/errorHandler"); // Destructure for clarity

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Alternative (built-in, no extra dep): app.use(express.json()); app.use(express.urlencoded({ extended: true }));

// Example: Access env vars
// console.log(process.env.DB_URL);  // For debugging

// Serve static files (assuming public/ exists; adjust path if needed)
app.use(express.static("../public")); // Relative to src/; or use absolute: path.join(__dirname, '../public')

// Routes
app.use("/api", routes);

// Basic root route (for HTML or fallback)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API! Visit /api/hello for a test." });
});

// 404 handler (before errorHandler)
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
