const PostModel = require("../models/post-model");

// Renvoie la liste complète des posts stockés dans MongoDB
const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find(); 
    res.status(200).json(posts);
  } catch (error) {
    next(error); 
  }
};



// Cette handler function permet de récupérer un post identifié par son id
const getPostById = async (req, res) => {
  try {
    const id = Number(req.params.id); 
    const post = await PostModel.findById({ _id: id });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found !' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    next(error); 
  }
};

// Cette handler function permet de créer un nouveau post dans la base de données
const createNewPost = async (req, res) => {
  try {
    // Récupérer le dernier _id pour incrémenter
    const lastPost = await PostModel.findOne().sort({ _id: -1 });
    const id = lastPost ? lastPost._id + 1 : 1;

    const { title, content, author, tags } = req.body;

    // Création d'une instance du modèle Post
    const newPost = new PostModel({
      _id: id,
      title,
      content,
      author,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Enregistrement du post dans la base
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    next(error); 
  }
};

// Cette handler function permet de mettre à jour un post existant
const updatePost = async (req, res) => {
  try {
    const id = Number(req.params.id); // conversion en nombre si _id est numérique
    const { title, content, author, tags } = req.body || {};

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        content,
        author,
        tags,
        updatedAt: new Date()
      },
      { new: true } // renvoie le document après modification
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found !' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error); 
  }
};

// Cette handler function permet de supprimer un post existant
const deletePost = async (req, res) => {
  try {
    const id = Number(req.params.id); // conversion en nombre si _id est numérique

    // Suppression du post par son _id
    const postDeleted = await PostModel.findOneAndDelete({ _id: id });

    if (!postDeleted) {
      return res.status(404).json({ message: "Post doesn't exist to delete it" });
    }

    // 200 OK avec message car 204 ne permet pas d'envoyer de texte
    res.status(200).send('Post Deleted !');
  } catch (error) {
    next(error); 
  }
};

// Export des fonctions pour les utiliser dans les routes
module.exports = { getPosts, getPostById, createNewPost, updatePost, deletePost };
