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
const express = require("express");
const serverless = require("serverless-http");

const app = express();

// Example route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express API" });
});

// ✅ Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);

