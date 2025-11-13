const app = require("./app"); // Import the configured app

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown (optional, for production)
process.on("SIGTERM", () => {
  console.log("SIGTERM received; shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = server; // If needed for testing
