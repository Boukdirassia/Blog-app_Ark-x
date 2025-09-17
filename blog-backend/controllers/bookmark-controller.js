const BookmarkModel = require('../models/bookmark-model');
const PostModel = require('../models/post-model');

// Récupérer tous les bookmarks d'un utilisateur
const getUserBookmarks = async (req, res, next) => {
  try {
    // Récupérer les IDs des posts sauvegardés par l'utilisateur
    const bookmarks = await BookmarkModel.find({ userId: req.user._id })
      .select('postId -_id');
    
    const postIds = bookmarks.map(bookmark => bookmark.postId);
    
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

// Vérifier si un post est sauvegardé par l'utilisateur
const checkBookmark = async (req, res, next) => {
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
    
    // Vérifier si l'utilisateur a sauvegardé ce post
    let isBookmarked = false;
    if (req.user) {
      const bookmark = await BookmarkModel.findOne({ 
        postId, 
        userId: req.user._id 
      });
      isBookmarked = !!bookmark;
    }
    
    res.status(200).json({
      success: true,
      data: {
        isBookmarked
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ajouter/Retirer un bookmark
const toggleBookmark = async (req, res, next) => {
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
    
    // Vérifier si l'utilisateur a déjà sauvegardé ce post
    const existingBookmark = await BookmarkModel.findOne({ 
      postId, 
      userId: req.user._id 
    });
    
    if (existingBookmark) {
      // Si le bookmark existe déjà, on le supprime
      await BookmarkModel.findByIdAndDelete(existingBookmark._id);
      
      res.status(200).json({
        success: true,
        message: 'Post retiré des favoris',
        action: 'removed'
      });
    } else {
      // Sinon, on ajoute un bookmark
      const newBookmark = new BookmarkModel({
        postId,
        userId: req.user._id,
        createdAt: new Date()
      });
      
      await newBookmark.save();
      
      res.status(201).json({
        success: true,
        message: 'Post ajouté aux favoris',
        action: 'added'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserBookmarks,
  checkBookmark,
  toggleBookmark
};
