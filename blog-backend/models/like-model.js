const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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

// Garantir qu'un utilisateur ne peut liker un post qu'une seule fois
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
