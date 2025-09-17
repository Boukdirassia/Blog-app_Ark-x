import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getPostById, deletePost, getCommentsByPostId, addComment, toggleLike, getLikesByPostId, toggleBookmark, checkBookmark } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, Tag, ChevronLeft, Heart, Bookmark, MessageSquare, Send } from 'lucide-react';
import '../styles/post-detail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Like state
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  
  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fetch post data
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchPost = async () => {
      if (!id || id === 'undefined') {
        if (isMounted) {
          setError('ID de l\'article manquant ou invalide.');
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(true);
      try {
        const response = await getPostById(id);
        if (!response) {
          throw new Error('Post not found');
        }
        const data = response.data || response;
        if (isMounted) {
          setPost(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
        if (isMounted) {
          setError('Impossible de charger l\'article. Il n\'existe peut-être plus.');
          // Redirect to home page after a short delay if post not found
          const timer = setTimeout(() => {
            if (isMounted) navigate('/');
          }, 3000);
          return () => clearTimeout(timer);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPost();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [id]); // Remove navigate from dependencies
  
  // Fetch likes, bookmarks and comments
  useEffect(() => {
    let isMounted = true;
    
    const fetchLikesAndBookmarks = async () => {
      if (!id || !user) return;
      
      try {
        // Fetch likes
        const likesResponse = await getLikesByPostId(id);
        if (isMounted) {
          setLikeCount(likesResponse.data.count);
          setIsLiked(likesResponse.data.userLiked);
        }
        
        // Fetch bookmark status
        const bookmarkResponse = await checkBookmark(id);
        if (isMounted) {
          setIsBookmarked(bookmarkResponse.data.isBookmarked);
        }
        
        // Fetch comments
        setCommentsLoading(true);
        const commentsResponse = await getCommentsByPostId(id);
        if (isMounted) {
          setComments(commentsResponse.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch post interactions:', err);
      } finally {
        if (isMounted) {
          setCommentsLoading(false);
        }
      }
    };
    
    fetchLikesAndBookmarks();
    
    return () => {
      isMounted = false;
    };
  }, [id, user]);

  // Handle post deletion
  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Impossible de supprimer l\'article. Veuillez réessayer plus tard.');
      setDeleteLoading(false);
    }
  };
  
  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLikeLoading(true);
    try {
      const response = await toggleLike(id);
      if (response.action === 'liked') {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      } else {
        setLikeCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setLikeLoading(false);
    }
  };
  
  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBookmarkLoading(true);
    try {
      const response = await toggleBookmark(id);
      setIsBookmarked(response.action === 'added');
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };
  
  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!commentContent.trim()) return;
    
    setCommentLoading(true);
    try {
      const response = await addComment(id, commentContent);
      setComments(prev => [response.data, ...prev]);
      setCommentContent('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          {error}
        </div>
        <Link to="/" className="btn btn-primary mt-4">
          <ArrowLeft size={18} className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          Article non trouvé
        </div>
        <Link to="/" className="btn btn-primary mt-4">
          <ArrowLeft size={18} className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="post-detail-container">
        <div className="post-detail-nav">
          <Link to="/" className="post-detail-back">
            <ChevronLeft size={16} />
            <span>Retour</span>
          </Link>
        </div>
        
        <article className="post-detail">
          <header className="post-detail-header">
            <h1 className="post-detail-title">{post.title}</h1>
            
            <div className="post-detail-meta">
              <div className="post-detail-meta-item">
                <User size={16} />
                <span>Par <strong>{post.author}</strong></span>
              </div>
              
              <div className="post-detail-meta-item">
                <Calendar size={16} />
                <span>Publié le {formatDate(post.createdAt)}</span>
              </div>
              
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <div className="post-detail-meta-item">
                  <Clock size={16} />
                  <span>Mis à jour le {formatDate(post.updatedAt)}</span>
                </div>
              )}
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="post-detail-tags">
                <Tag size={16} />
                <div className="post-detail-tags-list">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </header>
          
          {post.image && (
            <div className="post-detail-image-container">
              <img 
                src={`http://localhost:5000${post.image}`} 
                alt={post.title} 
                className="post-detail-image"
              />
            </div>
          )}
          
          <div className="post-detail-content">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
          
          <div className="post-detail-interactions">
            <div className="interaction-buttons">
              <button 
                className={`interaction-btn ${isLiked ? 'active' : ''}`} 
                onClick={handleLikeToggle}
                disabled={likeLoading}
              >
                <Heart size={20} fill={isLiked ? "#ff4757" : "none"} stroke={isLiked ? "#ff4757" : "currentColor"} />
                <span>{likeCount} {likeCount === 1 ? 'J\'aime' : 'J\'aimes'}</span>
              </button>
              
              <button 
                className={`interaction-btn ${isBookmarked ? 'active' : ''}`} 
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
              >
                <Bookmark size={20} fill={isBookmarked ? "#2e86de" : "none"} stroke={isBookmarked ? "#2e86de" : "currentColor"} />
                <span>{isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}</span>
              </button>
              
              <a href="#comments" className="interaction-btn">
                <MessageSquare size={20} />
                <span>{comments.length} {comments.length === 1 ? 'Commentaire' : 'Commentaires'}</span>
              </a>
            </div>
            
            {user && post.userId && user._id === post.userId._id && (
              <div className="post-detail-actions">
                <Link to={`/edit-post/${post._id}`} className="btn btn-secondary">
                  <Edit size={16} />
                  <span>Modifier</span>
                </Link>
                <button 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  <Trash2 size={16} />
                  <span>{deleteLoading ? 'Suppression...' : 'Supprimer'}</span>
                </button>
              </div>
            )}
          </div>
          
          <div id="comments" className="post-comments-section">
            <h3 className="comments-title">Commentaires ({comments.length})</h3>
            
            {user ? (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  className="form-control"
                  placeholder="Ajouter un commentaire..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                  rows={3}
                ></textarea>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={commentLoading || !commentContent.trim()}
                >
                  {commentLoading ? 'Envoi...' : 'Commenter'}
                  <Send size={16} className="ml-2" />
                </button>
              </form>
            ) : (
              <div className="login-to-comment">
                <p>Connectez-vous pour ajouter un commentaire</p>
                <Link to="/login" className="btn btn-outline-primary">Se connecter</Link>
              </div>
            )}
            
            <div className="comments-list">
              {commentsLoading ? (
                <LoadingSpinner size="small" />
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <strong className="comment-author">{comment.userId?.username || 'Utilisateur'}</strong>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))
              ) : (
                <p className="no-comments">Aucun commentaire pour le moment. Soyez le premier à commenter!</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
