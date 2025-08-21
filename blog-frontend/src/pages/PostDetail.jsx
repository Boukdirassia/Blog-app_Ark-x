import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import postsAPI from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, Tag, ChevronLeft } from 'lucide-react';
import '../styles/post-detail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('ID de l\'article manquant.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await postsAPI.getPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Impossible de charger l\'article. Il n\'existe peut-être plus.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Handle post deletion
  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await postsAPI.deletePost(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Impossible de supprimer l\'article. Veuillez réessayer plus tard.');
      setDeleteLoading(false);
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
          
          {post.imageUrl && (
            <div className="post-detail-image-container">
              <img 
                src={post.imageUrl} 
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
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
