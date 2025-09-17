const express = require("express");
const cors = require("cors");
const path = require("path");
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
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Import DB connection
const connectDB = require("./config/index");
connectDB();

// Import routes
const postRoutes = require("./routes/post-routes");
const authRoutes = require("./routes/auth-routes");
const commentRoutes = require("./routes/comment-routes");
const likeRoutes = require("./routes/like-routes");
const bookmarkRoutes = require("./routes/bookmark-routes");

// Appliquer les routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

//Middlewares (errorHandler et notFound) sont toujours utilises apres toutes les routes
app.use(notFound);
app.use(errorHandler)
// Start server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));
