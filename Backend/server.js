const express = require("express");
const app = express();
require('dotenv').config();
const requestLogger = require('./middleware/request-logger')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found');
// Middleware
app.use(express.json());
// utiliser le middleware pour toutes les requetes
app.use(requestLogger);
// Import DB connection
const connectDB = require("./config/index");
connectDB();

// Import routes
const router = require("./routes/post-routes");
app.use("/api", router);

//Middlewares (errorHandler et notFound) sont toujours utilises apres toutes les routes
app.use(notFound);
app.use(errorHandler)
// Start server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));
