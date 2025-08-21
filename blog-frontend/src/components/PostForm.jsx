import { useState, useEffect } from 'react';

const PostForm = ({ post, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});

  // If post is provided, populate form for editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        author: post.author || '',
        tags: post.tags ? post.tags.join(', ') : ''
      });
    }
  }, [post]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.content.trim()) newErrors.content = 'Le contenu est requis';
    if (!formData.author.trim()) newErrors.author = 'L\'auteur est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert tags string to array
      const processedData = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []
      };
      
      onSubmit(processedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2 className="post-form-title">
        {post ? 'Modifier l\'article' : 'Créer un nouvel article'}
      </h2>
      
      <div className="form-group">
        <label htmlFor="title" className="form-label">Titre</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.title && <p className="text-sm" style={{ color: 'var(--danger-color)' }}>{errors.title}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="author" className="form-label">Auteur</label>
        <input
          type="text"
          id="author"
          name="author"
          className="form-input"
          value={formData.author}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.author && <p className="text-sm" style={{ color: 'var(--danger-color)' }}>{errors.author}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="content" className="form-label">Contenu</label>
        <textarea
          id="content"
          name="content"
          className="form-input"
          rows="10"
          value={formData.content}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.content && <p className="text-sm" style={{ color: 'var(--danger-color)' }}>{errors.content}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="tags" className="form-label">Tags (séparés par des virgules)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          className="form-input"
          value={formData.tags}
          onChange={handleChange}
          placeholder="technologie, actualité, lifestyle"
          disabled={isLoading}
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={isLoading}
      >
        {isLoading ? 'Chargement...' : (post ? 'Mettre à jour' : 'Publier')}
      </button>
    </form>
  );
};

export default PostForm;
