const express = require("express");
const router = express.Router();
const {getPosts, getPostById, createNewPost, updatePost, deletePost} = require("../controllers/post-controller");

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/",createNewPost);
router.put("/:id", updatePost)
router.delete("/:id", deletePost)


module.exports = router;
