import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Edit2, Tag, Clock, Heart, MessageCircle, Eye, Bookmark, Trash2 } from 'lucide-react';
import { useState } from 'react';
import '../styles/post-card.css';
import postsAPI from '../services/api';
import { useNotification } from '../context/NotificationContext';

const PostCard = ({ post, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useNotification();
  
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
      await postsAPI.deletePost(post._id);
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

  // Truncate content for preview
  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article 
      className={`modern-post-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="post-card-header">
        <div className="post-author-info">
          <div className="author-avatar">
            <User size={16} />
          </div>
          <div className="author-details">
            <span className="author-name">{post.author}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        <button 
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark size={18} />
        </button>
      </div>

      {post.imageUrl && (
        <div className="post-image-container">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="post-image"
            loading="lazy"
          />
          <div className="image-overlay"></div>
        </div>
      )}

      <div className="post-content">
        <div className="post-tags">
          {post.tags && post.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="post-tag">{tag}</span>
          ))}
        </div>

        <h2 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        
        <p className="post-excerpt">{truncateContent(post.content)}</p>

      </div>

      <div className="post-footer">
        <div className="post-actions">
          <Link to={`/posts/${post._id}`} className="read-more-btn">
            <span>Lire</span>
            <ArrowRight size={16} className="arrow-icon" />
          </Link>
          
          <Link to={`/edit-post/${post._id}`} className="edit-btn" aria-label="Modifier">
            <Edit2 size={16} />
          </Link>
          
          <button 
            onClick={handleDelete}
            className="delete-btn" 
            aria-label="Supprimer"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
