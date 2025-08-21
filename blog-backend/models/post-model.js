const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  _id: Number,
  title: { 
    type: String, 
    required: [true, "Le titre est obligatoire"], // obligatoire
    minlength: [3, "Le titre doit contenir au moins 3 caractères"], // min 3 caractères
    maxlength: [120, "Le titre ne peut pas dépasser 120 caractères"] // max 120 caractères
  },
  content: { 
    type: String, 
    required: [true, "Le contenu est obligatoire"],
    minlength: [10, "Le contenu doit contenir au moins 10 caractères"]
  },
  author: { 
    type: String, 
    required: [true, "L'auteur est obligatoire"]
  },
  tags: { 
    type: [String], 
    required: [true, "Les tags sont obligatoires"],
    validate: {
      validator: function(arr) {
        return arr.length > 0; 
      }
    }
  },
  createdAt: Date,
  updatedAt:Date
})

module.exports = mongoose.model('Post', postSchema);
