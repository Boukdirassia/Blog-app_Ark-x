const express = require("express");
const router = express.Router();
const {getPosts, getPostById, createNewPost, updatePost, deletePost} = require("../controllers/post-controller");

router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.post("/posts",createNewPost);
router.put("/posts/:id", updatePost)
router.delete("/posts/:id", deletePost)


module.exports = router;
