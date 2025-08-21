import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postsAPI from '../services/api';
import PostForm from '../components/PostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  // Handle form submission
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const updatedPost = await postsAPI.updatePost(id, formData);
      showSuccess('Article mis à jour avec succès!');
      navigate(`/post/${updatedPost._id}`);
    } catch (err) {
      console.error('Failed to update post:', err);
      const errorMessage = 'Impossible de mettre à jour l\'article. Veuillez réessayer plus tard.';
      setError(errorMessage);
      showError(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <h1 className="mb-4">Modifier l'article</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <h1 className="mb-4">Modifier l'article</h1>
        <div className="alert alert-danger">
          {error}
        </div>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => navigate('/')}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Modifier l'article</h1>
      
      <PostForm 
        post={post}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </div>
  );
};

export default EditPost;
