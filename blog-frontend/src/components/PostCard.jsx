import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Edit2, Tag, Clock, Heart, MessageCircle, Eye, Bookmark, Trash2, Share, MoreHorizontal, ThumbsUp, Smile } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/post-card.css';
import api, { toggleLike, toggleBookmark, deletePost } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';

const PostCard = ({ post, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likesCount, setLikesCount] = useState(post.stats?.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.stats?.comments || 0);
  const [userLiked, setUserLiked] = useState(post.stats?.userLiked || false);
  const [userBookmarked, setUserBookmarked] = useState(post.stats?.userBookmarked || false);
  const { showSuccess, showError } = useNotification();
  const { isAuthenticated, user } = useAuth();
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Handle delete post
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      showSuccess('Article supprimé avec succès!');
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      showError('Impossible de supprimer l\'article. Veuillez réessayer plus tard.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Gérer la mise à jour des likes
  const handleLikeUpdate = (liked, count) => {
    setUserLiked(liked);
    setLikesCount(count);
  };
  
  // Gérer la mise à jour des bookmarks
  const handleBookmarkUpdate = (bookmarked) => {
    setUserBookmarked(bookmarked);
  };
  
  // Vérifier si l'utilisateur est le propriétaire du post
  const isPostOwner = () => {
    return user && post.userId && user._id === post.userId._id;
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article className="blog-post-card">
      <div className="post-card-header">
        <div className="post-author-info">
          <div className="author-avatar">
            <User size={20} />
          </div>
          <div className="author-details">
            <span className="author-name">{post.userId ? post.userId.username : 'Utilisateur inconnu'}</span>
            <div className="post-meta-info">
              <span className="post-date">{formatDate(post.createdAt)}</span>
              <span className="post-visibility">• Public</span>
            </div>
          </div>
        </div>
        <div className="post-header-actions">
          <BookmarkButton 
            postId={post._id}
            initialBookmarked={userBookmarked}
            onBookmarkUpdate={handleBookmarkUpdate}
          />
          <button className="post-action-btn more-options-btn">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="post-content">
        <p className="post-text">{post.title}</p>
        <p className="post-excerpt">{truncateContent(post.content)}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="post-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {post.image && (
        <div className="post-image-container">
          <img 
            src={`http://localhost:5000${post.image}`} 
            alt={post.title} 
            className="post-image"
            loading="lazy"
          />
        </div>
      )}

      <div className="post-engagement-stats">
        <div className="engagement-left">
          <div className="reaction-icons">
            <span className="reaction-icon like-icon"><ThumbsUp size={14} /></span>
          </div>
          <span className="like-count">{likesCount}</span>
        </div>
        <div className="engagement-right">
          <span className="comment-count">{commentsCount} commentaires</span>
          <span className="view-count"><Eye size={14} /> {post.stats?.views || 0} vues</span>
        </div>
      </div>

      <div className="post-action-buttons">
        <LikeButton 
          postId={post._id}
          initialLikes={likesCount}
          initialUserLiked={userLiked}
          onLikeUpdate={handleLikeUpdate}
          className="post-action-btn"
        />
        <Link to={`/posts/${post._id}`} className="post-action-btn comment-btn">
          <MessageCircle size={20} />
          <span>Commenter</span>
        </Link>
        <button className="post-action-btn share-btn">
          <Share size={20} />
          <span>Partager</span>
        </button>
      </div>
      
      {isPostOwner() && (
        <div className="owner-actions">
          <Link to={`/edit-post/${post._id}`} className="edit-btn" aria-label="Modifier">
            <Edit2 size={16} />
            <span>Modifier</span>
          </Link>
          
          <button 
            onClick={handleDelete}
            className="delete-btn" 
            aria-label="Supprimer"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </article>
  );
};

export default PostCard;
