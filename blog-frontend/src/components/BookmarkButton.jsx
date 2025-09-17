import React, { useState } from 'react';
import { toggleBookmark } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bookmark } from 'lucide-react';
import './SocialButtons.css';

const BookmarkButton = ({ postId, initialBookmarked, onBookmarkUpdate }) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked || false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion ou afficher un message
      alert('Veuillez vous connecter pour sauvegarder ce post');
      return;
    }

    setLoading(true);
    try {
      const response = await toggleBookmark(postId);
      const { bookmarked: isBookmarked } = response.data;
      
      setBookmarked(isBookmarked);
      
      // Notifier le composant parent du changement
      if (onBookmarkUpdate) {
        onBookmarkUpdate(isBookmarked);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`post-action-btn ${bookmarked ? 'bookmarked' : ''} ${loading ? 'disabled' : ''}`}
      onClick={handleBookmarkClick}
      disabled={loading}
      title={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Bookmark size={20} className={bookmarked ? 'bookmarked' : ''} fill={bookmarked ? 'currentColor' : 'none'} />
    </button>
  );
};

export default BookmarkButton;
