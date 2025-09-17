import React, { useState, useEffect } from 'react';
import { getCommentsByPostId, addComment, updateComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Comments.css';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Charger les commentaires au chargement du composant
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Récupérer les commentaires
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCommentsByPostId(postId);
      setComments(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError('Impossible de charger les commentaires. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un nouveau commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await addComment(postId, newComment);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
      setError('Impossible d\'ajouter votre commentaire. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Commencer l'édition d'un commentaire
  const handleStartEdit = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  // Mettre à jour un commentaire
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await updateComment(commentId, editContent);
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data : comment
      ));
      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du commentaire:', err);
      setError('Impossible de mettre à jour votre commentaire. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire:', err);
      setError('Impossible de supprimer votre commentaire. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est le propriétaire du commentaire
  const isCommentOwner = (comment) => {
    return user && comment.userId && user._id === comment.userId._id;
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="comments-section">
      <h3>Commentaires ({comments.length})</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Formulaire pour ajouter un commentaire */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            required
          />
          <button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? 'Envoi...' : 'Commenter'}
          </button>
        </form>
      ) : (
        <p className="login-prompt">Connectez-vous pour ajouter un commentaire.</p>
      )}
      
      {/* Liste des commentaires */}
      <div className="comments-list">
        {loading && comments.length === 0 ? (
          <p>Chargement des commentaires...</p>
        ) : comments.length === 0 ? (
          <p>Aucun commentaire pour l'instant. Soyez le premier à commenter !</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.userId ? comment.userId.username : 'Utilisateur inconnu'}
                </span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              
              {editingComment === comment._id ? (
                <div className="edit-comment-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => handleUpdateComment(comment._id)}
                      disabled={loading || !editContent.trim()}
                    >
                      Enregistrer
                    </button>
                    <button onClick={handleCancelEdit}>Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="comment-content">{comment.content}</p>
                  {isCommentOwner(comment) && (
                    <div className="comment-actions">
                      <button onClick={() => handleStartEdit(comment)}>Modifier</button>
                      <button onClick={() => handleDeleteComment(comment._id)}>Supprimer</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
