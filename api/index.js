const express = require("express");
const cors = require("cors");

const { errorHandler } = require("./middleware/errorHandler.js");
const { requestLogger } = require("./middleware/requestLogger.js");
const { rateLimiter } = require("./middleware/rateLimiter.js");
const analysisRoutes = require("./routes/analysis.js");
const healthRoutes = require("./routes/health.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter);

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api", analysisRoutes);

// Test route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express API" });
});

// Error handler
app.use(errorHandler);

// Export for Vercel serverless
module.exports = app;

// const express = require("express");
// const serverless = require("serverless-http");
// const cors = require("cors");
// const path = require("path");

// const analysisRoutes = require("./routes/analysis.js");
// const healthRoutes = require("./routes/health.js");
// const { errorHandler } = require("./middleware/errorHandler.js");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: "10mb" }));

// // API Routes
// app.use("/api/health", healthRoutes);
// app.use("/api", analysisRoutes);

// // Test route
// app.get("/api/hello", (req, res) => res.json({ message: "Hello from Express API" }));

// // Serve React app for non-API routes
// app.use(express.static(path.join(process.cwd(), "build")));
// app.get(/^(?!\/api).*/, (req, res) => {
//   if (!req.path.startsWith("/api")) {
//     res.sendFile(path.join(process.cwd(), "build", "index.html"));
//   }
// });

// // Error handler
// app.use(errorHandler);

// // Export for serverless
// module.exports = app;
// module.exports.handler = serverless(app);

// // Local dev
// // if (require.main === module) {
// //   const PORT = process.env.PORT || 3000;
// //   app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
// // }
