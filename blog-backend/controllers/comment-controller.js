const CommentModel = require('../models/comment-model');
const PostModel = require('../models/post-model');

// Récupérer tous les commentaires d'un post
const getCommentsByPostId = async (req, res, next) => {
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
    
    // Récupérer les commentaires
    const comments = await CommentModel.find({ postId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// Ajouter un commentaire à un post
const addComment = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    const { content } = req.body;
    
    // Vérifier que le post existe
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }
    
    // Créer le commentaire
    const newComment = new CommentModel({
      content,
      postId,
      userId: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newComment.save();
    
    // Récupérer le commentaire avec les infos utilisateur
    const savedComment = await CommentModel.findById(newComment._id)
      .populate('userId', 'username email');
    
    res.status(201).json({
      success: true,
      data: savedComment
    });
  } catch (error) {
    next(error);
  }
};

// Modifier un commentaire
const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    
    // Vérifier que le commentaire existe
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Commentaire non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez modifier que vos propres commentaires'
      });
    }
    
    // Mettre à jour le commentaire
    comment.content = content;
    comment.updatedAt = new Date();
    await comment.save();
    
    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un commentaire
const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    
    // Vérifier que le commentaire existe
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Commentaire non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez supprimer que vos propres commentaires'
      });
    }
    
    // Supprimer le commentaire
    await CommentModel.findByIdAndDelete(commentId);
    
    res.status(200).json({
      success: true,
      message: 'Commentaire supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByPostId,
  addComment,
  updateComment,
  deleteComment
};
