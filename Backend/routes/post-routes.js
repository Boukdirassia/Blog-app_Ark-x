const express = require("express");
const router = express.Router();
const getPosts = require("../controllers/post-controller");

router.get("/posts", getPosts);

module.exports = router;
