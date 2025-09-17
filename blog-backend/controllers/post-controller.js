const PostModel = require("../models/post-model");
const CommentModel = require("../models/comment-model");
const LikeModel = require("../models/like-model");
const BookmarkModel = require("../models/bookmark-model");
const path = require('path');
const fs = require('fs');

// Renvoie la liste complète des posts stockés dans MongoDB
const getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate('userId', 'username email');
    
    // Ajouter les informations de likes et commentaires pour chaque post
    const postsWithStats = await Promise.all(posts.map(async (post) => {
      const postObj = post.toObject();
      
      // Compter les likes
      const likesCount = await LikeModel.countDocuments({ postId: post._id });
      
      // Compter les commentaires
      const commentsCount = await CommentModel.countDocuments({ postId: post._id });
      
      // Vérifier si l'utilisateur connecté a liké ce post
      let userLiked = false;
      let userBookmarked = false;
      
      if (req.user) {
        const userLike = await LikeModel.findOne({ 
          postId: post._id, 
          userId: req.user._id 
        });
        userLiked = !!userLike;
        
        const userBookmark = await BookmarkModel.findOne({ 
          postId: post._id, 
          userId: req.user._id 
        });
        userBookmarked = !!userBookmark;
      }
      
      return {
        ...postObj,
        stats: {
          likes: likesCount,
          comments: commentsCount,
          userLiked,
          userBookmarked
        }
      };
    }));
    
    res.status(200).json({
      success: true,
      data: postsWithStats
    });
  } catch (error) {
    next(error); 
  }
};



// Cette handler function permet de récupérer un post identifié par son id
const getPostById = async (req, res, next) => {
  try {
    const id = Number(req.params.id); 
    const post = await PostModel.findById({ _id: id }).populate('userId', 'username email');
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post non trouvé' 
      });
    }
    
    // Convertir en objet pour pouvoir ajouter des propriétés
    const postObj = post.toObject();
    
    // Récupérer les commentaires associés à ce post
    const comments = await CommentModel.find({ postId: id })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    
    // Compter les likes
    const likesCount = await LikeModel.countDocuments({ postId: id });
    
    // Vérifier si l'utilisateur connecté a liké ce post
    let userLiked = false;
    let userBookmarked = false;
    
    if (req.user) {
      const userLike = await LikeModel.findOne({ 
        postId: id, 
        userId: req.user._id 
      });
      userLiked = !!userLike;
      
      const userBookmark = await BookmarkModel.findOne({ 
        postId: id, 
        userId: req.user._id 
      });
      userBookmarked = !!userBookmark;
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...postObj,
        comments,
        stats: {
          likes: likesCount,
          comments: comments.length,
          userLiked,
          userBookmarked
        }
      }
    });
  } catch (error) {
    next(error); 
  }
};

// Cette handler function permet de créer un nouveau post dans la base de données
const createNewPost = async (req, res, next) => {
  try {
    // Récupérer le dernier _id pour incrémenter
    const lastPost = await PostModel.findOne().sort({ _id: -1 });
    const id = lastPost ? lastPost._id + 1 : 1;

    const { title, content, tags } = req.body;

    // Création d'une instance du modèle Post
    const newPost = new PostModel({
      _id: id,
      title,
      content,
      author: req.user.username, // Utiliser le nom d'utilisateur connecté
      userId: req.user._id, // Associer le post à l'utilisateur
      tags,
      // Ajouter l'image si elle existe
      image: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Enregistrement du post dans la base
    await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Post créé avec succès',
      data: newPost
    });
  } catch (error) {
    next(error); 
  }
};

// Cette handler function permet de mettre à jour un post existant
const updatePost = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, content, tags } = req.body || {};

    // Vérifier que le post existe et appartient à l'utilisateur
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post non trouvé' 
      });
    }

    // Vérifier la propriété (seul le propriétaire peut modifier)
    if (existingPost.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous ne pouvez modifier que vos propres posts' 
      });
    }

    // Préparer les données à mettre à jour
    const updateData = {
      title,
      content,
      tags,
      updatedAt: new Date()
    };

    // Ajouter l'image si elle existe dans la requête
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (existingPost.image) {
        const oldImagePath = path.join(__dirname, '..', existingPost.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Post mis à jour avec succès',
      data: updatedPost
    });
  } catch (error) {
    next(error); 
  }
};

// Cette handler function permet de supprimer un post existant
const deletePost = async (req, res, next) => {
  try {
    // Convertir l'ID en nombre si c'est un nombre, sinon utiliser la valeur telle quelle
    let id;
    try {
      id = Number(req.params.id);
    } catch (e) {
      id = req.params.id;
    }

    console.log('Tentative de suppression du post avec ID:', id);

    // Vérifier que le post existe et appartient à l'utilisateur
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      console.log('Post non trouvé:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Post non trouvé' 
      });
    }

    console.log('Post trouvé:', existingPost._id);

    // Vérifier la propriété (seul le propriétaire peut supprimer)
    if (existingPost.userId && req.user._id && 
        existingPost.userId.toString() !== req.user._id.toString()) {
      console.log('Utilisateur non autorisé à supprimer ce post');
      return res.status(403).json({ 
        success: false, 
        message: 'Vous ne pouvez supprimer que vos propres posts' 
      });
    }

    // Supprimer l'image associée au post si elle existe
    if (existingPost.image) {
      try {
        // Le chemin de l'image est stocké comme /uploads/filename.jpg
        // Nous devons donc le convertir en chemin absolu
        const imagePath = path.join(__dirname, '..', existingPost.image);
        console.log('Tentative de suppression de l\'image:', imagePath);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Image supprimée avec succès');
        } else {
          console.log('Le fichier image n\'existe pas:', imagePath);
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'image:', err);
        // Continuer même si la suppression de l'image échoue
      }
    }

    // Suppression du post
    const result = await PostModel.findByIdAndDelete(id);
    console.log('Résultat de la suppression:', result);

    res.status(200).json({
      success: true,
      message: 'Post supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    next(error); 
  }
};

// Export des fonctions pour les utiliser dans les routes
module.exports = { getPosts, getPostById, createNewPost, updatePost, deletePost };
