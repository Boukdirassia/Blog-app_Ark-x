import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postsAPI from '../services/api';
import PostForm from '../components/PostForm';
import { useNotification } from '../context/NotificationContext';

const AddPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newPost = await postsAPI.createPost(formData);
      showSuccess('Article créé avec succès!');
      navigate('/');
    } catch (err) {
      console.error('Failed to create post:', err);
      const errorMessage = 'Impossible de créer l\'article. Veuillez réessayer plus tard.';
      setError(errorMessage);
      showError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Créer un nouvel article</h1>
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      <PostForm 
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
};

export default AddPost;
