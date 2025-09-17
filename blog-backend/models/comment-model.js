const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: [true, "Le contenu du commentaire est obligatoire"],
    minlength: [1, "Le commentaire ne peut pas être vide"],
    maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"]
  },
  postId: {
    type: Number,
    ref: 'Post',
    required: [true, "L'ID du post est obligatoire"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "L'ID de l'utilisateur est obligatoire"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);
