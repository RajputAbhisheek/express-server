const SmeeClient = require("smee-client");

const smee = new SmeeClient({
  source: "https://smee.io/Srj3EtpNgQTLHbR", // Replace with your smee.io URL (e.g., https://smee.io/abc123)
  target: "http://localhost:3000/api/webhook/orders-updated", // Your webhook route
  logger: console, // Uses console for logs
});

const events = smee.start();
console.log(
  "🔗 Smee forwarding started! Events will log here and hit your server."
);

// Graceful stop (Ctrl+C)
process.on("SIGINT", () => {
  events.close();
  console.log("🛑 Smee forwarding stopped.");
  process.exit();
});
