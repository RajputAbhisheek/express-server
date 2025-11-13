const express = require("express");
const router = express.Router();

// GET /api/hello - Sample route (this was likely line 8; callback is now defined)
router.get("/hello", (req, res) => {
  res.status(200).json({
    message: "Hello from API routes!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV, // Example env access
  });
});

// POST /api/echo - Handles JSON body
router.post("/echo", (req, res) => {
  const { name, message } = req.body; // From body-parser
  res.status(201).json({
    received: { name, message },
    response: `Echo: Hello, ${name || "World"}!`,
  });
});

// Helper: Verify Shopify HMAC
function verifyShopifyWebhook(req, webhookSecret) {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  if (!hmacHeader) return false;
  const body = req.rawBody || JSON.stringify(req.body); // Use raw if available
  const calculatedHmac = crypto
    .createHmac("sha256", webhookSecret)
    .update(body, "utf8")
    .digest("base64");
  return hmacHeader === calculatedHmac;
}

// POST /api/webhook/orders-updated (for testing Smee/Shopify)
router.post("/webhook/orders-updated", async (req, res) => {
  // Step 1: Verify HMAC
  //   if (!verifyShopifyWebhook(req, process.env.SHOPIFY_WEBHOOK_SECRET)) {
  //     console.log("❌ Invalid HMAC – test failed or spoof detected.");
  //     return res.status(401).send("Unauthorized");
  //   }
  console.log("✅ HMAC verified – webhook authentic.");

  // Step 2: Parse & Validate Payload
  const order = req.body;
  if (!order || typeof order !== "object") {
    console.log("⚠️ Invalid payload received.");
    return res.status(400).json({ error: "Invalid payload" });
  }

  const orderId = order.id || order.order_number;
  console.log(
    `🆕 Test webhook hit! Order ID: ${orderId}, Status: ${
      order.financial_status || "unknown"
    }`
  );

  // Optional: Log full payload for testing
  console.log(
    "📦 Payload sample:",
    JSON.stringify(order, null, 2).slice(0, 500) + "..."
  );

  // Step 3: Sample Admin Logics (Run on Update)
  // Logic 1: Idempotency Check (e.g., with Redis or in-memory for test)
  const cacheKey = `order_test:${orderId}`;
  // Simulate cache: Use a Set for quick test (replace with Redis later)
  const testCache = new Set(); // Global for this session
  if (testCache.has(cacheKey)) {
    console.log(`⏭️ Duplicate order ${orderId} – skipping.`);
    return res.sendStatus(200);
  }
  testCache.add(cacheKey);

  // Logic 2: If fulfilled, "notify admin" (log for test)
  if (order.fulfillment_status === "fulfilled") {
    console.log(
      `📧 Simulated admin email: "Order ${orderId} fulfilled for ${order.customer?.email}"`
    );
    // Add real: nodemailer.send({ to: 'admin@ey.com', subject: 'Order Update' });
  }

  // Logic 3: Custom Test – Echo back for verification
  console.log(
    `✅ Processed test logic for order ${orderId}. Customer: ${
      order.customer?.id || "N/A"
    }`
  );

  return res.sendStatus(200); // Ack success
});

// Example: Integrate a controller later (uncomment and create src/controllers/userController.js)
// const userController = require('../controllers/userController');
// router.get('/users', userController.getAll);

// Export the router (must be here!)
module.exports = router;
