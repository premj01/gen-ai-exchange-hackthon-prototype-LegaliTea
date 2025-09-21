// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const { errorHandler } = require('./middleware/errorHandler.js');
// const { requestLogger } = require('./middleware/requestLogger.js');
// const { rateLimiter } = require('./middleware/rateLimiter.js');
// const analysisRoutes = require('./routes/analysis.js');
// const healthRoutes = require('./routes/health.js');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(requestLogger);
// app.use(rateLimiter);

// // Routes
// app.use('/api/health', healthRoutes);
// app.use('/api', analysisRoutes);

// app.post("hi", (req, res) => {
//   res.json({ msg: "Hello" })
// })
// app.post("/api/hi", (req, res) => {
//   res.json({ msg: "API Hello" })
// })

// // Serve static files in production (Note: express.static() won't work on Vercel)
// // Use public directory instead for static assets
// // if (process.env.NODE_ENV === 'production') {
// //   app.use(express.static('public'));

// //   // SPA fallback for client-side routing
// //   app.get('*', (req, res) => {
// //     res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
// //   });
// // }

// // Error handling middleware (must be last)
// app.use(errorHandler);

// module.exports = app;
const express = require("express");
const cors = require("cors");
const path = require("path");

const { errorHandler } = require("./middleware/errorHandler.js");
const { requestLogger } = require("./middleware/requestLogger.js");
const { rateLimiter } = require("./middleware/rateLimiter.js");
const analysisRoutes = require("./routes/analysis.js");
const healthRoutes = require("./routes/health.js");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter);

app.use("/api/health", healthRoutes);
app.use("/api", analysisRoutes);

// ✅ Serve React build
app.use(express.static(path.join(process.cwd(), "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "build", "index.html"));
});

// Error handler
app.use(errorHandler);

module.exports = app;
