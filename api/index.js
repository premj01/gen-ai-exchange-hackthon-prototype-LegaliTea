// api/index.js
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");

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

// Routes
app.use("/api/health", healthRoutes);
app.use("/api", analysisRoutes);

// Example test route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express API" });
});

// Serve React build
app.use(express.static(path.join(process.cwd(), "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "build", "index.html"));
});

// Error handler
app.use(errorHandler);

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);

// Optional local dev
if (require.main === module) {
  app.listen(3000, () =>
    console.log("Local server running at http://localhost:3000")
  );
}

// const app = require('./app.js');
// require('dotenv').config();

// const PORT = process.env.PORT || 3001;



// // Export for Vercel serverless functions

// // For local development only
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`🍵 LegaliTea Server running on http://localhost:${PORT}`);
//     console.log(`🤖 Gemini API configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
//     console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//   });
// }

// module.exports = app;




