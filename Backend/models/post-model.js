const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
});
const PostModel = mongoose.model("posts", postSchema);

module.exports = PostModel;
