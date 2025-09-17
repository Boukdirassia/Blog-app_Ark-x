const express = require("express");
const router = express.Router();
const {getPosts, getPostById, createNewPost, updatePost, deletePost} = require("../controllers/post-controller");
const { authMiddleware, optionalAuth } = require("../middleware/auth-middleware");
const upload = require("../middleware/upload-middleware");

// Routes publiques (lecture)
router.get("/", optionalAuth, getPosts);
router.get("/:id", optionalAuth, getPostById);

// Routes protégées (écriture)
router.post("/", authMiddleware, upload.single('image'), createNewPost);
router.put("/:id", authMiddleware, upload.single('image'), updatePost);
router.delete("/:id", authMiddleware, deletePost);


module.exports = router;
