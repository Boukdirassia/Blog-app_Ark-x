const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
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
  }
});

// Garantir qu'un utilisateur ne peut sauvegarder un post qu'une seule fois
bookmarkSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
