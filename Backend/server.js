const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Import DB connection
const connectDB = require("./config/index");
connectDB();

// Import routes
const router = require("./routes/post-routes");
app.use("/", router);

// Start server
app.listen(3000, () => console.log("Server is running on 3000"));
