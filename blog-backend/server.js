const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const requestLogger = require('./middleware/request-logger')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found');

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Middleware
app.use(express.json());
// utiliser le middleware pour toutes les requetes
app.use(requestLogger);
// Import DB connection
const connectDB = require("./config/index");
connectDB();

// Import routes
const router = require("./routes/post-routes");
app.use("/api/posts", router);

//Middlewares (errorHandler et notFound) sont toujours utilises apres toutes les routes
app.use(notFound);
app.use(errorHandler)
// Start server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));
