import React, { useState } from 'react';
import { toggleLike } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp } from 'lucide-react';
import './SocialButtons.css';

const LikeButton = ({ postId, initialLikes, initialUserLiked, onLikeUpdate }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [userLiked, setUserLiked] = useState(initialUserLiked || false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion ou afficher un message
      alert('Veuillez vous connecter pour aimer ce post');
      return;
    }

    setLoading(true);
    try {
      const response = await toggleLike(postId);
      const { liked, likesCount } = response.data;
      
      setUserLiked(liked);
      setLikes(likesCount);
      
      // Notifier le composant parent du changement
      if (onLikeUpdate) {
        onLikeUpdate(liked, likesCount);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`post-action-btn ${userLiked ? 'active' : ''} ${loading ? 'disabled' : ''}`}
      onClick={handleLikeClick}
      disabled={loading}
    >
      <ThumbsUp size={20} className={userLiked ? 'liked' : ''} />
      <span>{userLiked ? 'Aimé' : 'Aimer'}</span>
    </button>
  );
};

export default LikeButton;
