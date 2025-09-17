const LikeModel = require('../models/like-model');
const PostModel = require('../models/post-model');

// Récupérer le nombre de likes pour un post
const getLikesByPostId = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    
    // Vérifier que le post existe
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }
    
    // Compter les likes
    const likesCount = await LikeModel.countDocuments({ postId });
    
    // Vérifier si l'utilisateur connecté a liké ce post
    let userLiked = false;
    if (req.user) {
      const userLike = await LikeModel.findOne({ 
        postId, 
        userId: req.user._id 
      });
      userLiked = !!userLike;
    }
    
    res.status(200).json({
      success: true,
      data: {
        count: likesCount,
        userLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ajouter/Retirer un like à un post
const toggleLike = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    
    // Vérifier que le post existe
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur a déjà liké ce post
    const existingLike = await LikeModel.findOne({ 
      postId, 
      userId: req.user._id 
    });
    
    if (existingLike) {
      // Si le like existe déjà, on le supprime (unlike)
      await LikeModel.findByIdAndDelete(existingLike._id);
      
      res.status(200).json({
        success: true,
        message: 'Like retiré avec succès',
        action: 'unliked'
      });
    } else {
      // Sinon, on ajoute un like
      const newLike = new LikeModel({
        postId,
        userId: req.user._id,
        createdAt: new Date()
      });
      
      await newLike.save();
      
      res.status(201).json({
        success: true,
        message: 'Post liké avec succès',
        action: 'liked'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les posts likés par un utilisateur
const getLikedPostsByUser = async (req, res, next) => {
  try {
    // Récupérer les IDs des posts likés par l'utilisateur
    const likedPosts = await LikeModel.find({ userId: req.user._id })
      .select('postId -_id');
    
    const postIds = likedPosts.map(like => like.postId);
    
    // Récupérer les posts correspondants
    const posts = await PostModel.find({ _id: { $in: postIds } })
      .populate('userId', 'username email');
    
    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLikesByPostId,
  toggleLike,
  getLikedPostsByUser
};
