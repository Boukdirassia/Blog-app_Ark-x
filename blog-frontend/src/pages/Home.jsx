import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Calendar, ArrowUpDown, AlertCircle, BookOpen, Clock, TrendingUp, Users, Star, Zap, ArrowRight, PenTool, Eye, Heart, MessageCircle, Sparkles, Award, Target, Share2, Edit, Trash2 } from 'lucide-react';
import postsAPI, { getPosts } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import '../styles/home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const postsPerPage = 6;

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    try {
      await postsAPI.deletePost(postId);
      // Refresh posts after deletion
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Impossible de supprimer l\'article. Veuillez réessayer plus tard.');
    }
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await postsAPI.getPosts();
      
      // Filter posts based on search query and category
      let filteredPosts = data;
      
      // Apply category filter
      if (selectedCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
          post.tags && post.tags.some(tag => 
            tag.toLowerCase() === selectedCategory.toLowerCase()
          )
        );
      }
      
      // Apply search filter
      if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.tags && post.tags.some(tag => 
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        );
      }
      
      // Sort posts
      filteredPosts.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      // Paginate posts
      const startIndex = (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      setPosts(paginatedPosts);
      setTotalPages(Math.max(1, Math.ceil(filteredPosts.length / postsPerPage)));
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Impossible de charger les articles. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Handle post deletion
  const handlePostDelete = (deletedPostId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
  };

  // Fetch posts when dependencies change
  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery, sortField, sortOrder, selectedCategory]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const toggleSort = (field) => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Featured articles carousel - using real post IDs if available
  const getFeaturedArticles = () => {
    if (posts.length >= 3) {
      return posts.slice(0, 3).map(post => ({
        id: post._id,
        title: post.title,
        excerpt: post.content ? post.content.substring(0, 120) + '...' : post.excerpt || "Découvrez cet article passionnant...",
        author: post.author || "Auteur",
        category: post.tags && post.tags[0] ? post.tags[0] : "Article",
        image: post.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
      }));
    }
    
    // Fallback static articles if no posts available
    return [
      {
        id: "featured-1",
        title: "L'avenir de l'Intelligence Artificielle en 2024",
        excerpt: "Découvrez les tendances et innovations qui façonneront l'IA cette année.",
        author: "Marie Dubois",
        category: "Tech",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
      },
      {
        id: "featured-2",
        title: "Design System : Guide Complet pour 2024",
        excerpt: "Comment créer et maintenir un design system efficace pour vos projets.",
        author: "Pierre Martin",
        category: "Design",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop"
      },
      {
        id: "featured-3",
        title: "React 18 : Nouvelles Fonctionnalités",
        excerpt: "Explorez les dernières fonctionnalités de React 18 et comment les utiliser.",
        author: "Sophie Laurent",
        category: "Development",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
      }
    ];
  };

  const featuredArticles = getFeaturedArticles();

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  // Auto-rotate featured articles
  useEffect(() => {
    const interval = setInterval(nextFeatured, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load more posts functionality
  const loadMorePosts = async () => {
    if (loadingMore || !hasMorePosts) return;
    
    setLoadingMore(true);
    try {
      const data = await postsAPI.getPosts();
      // Simulate loading more posts (in real app, this would be paginated)
      const newPosts = data.slice(posts.length, posts.length + postsPerPage);
      
      if (newPosts.length === 0) {
        setHasMorePosts(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Get available categories from posts
  const getCategories = () => {
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.slice(0, 6); // Limit to 6 categories
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
          <div className="hero-orbs">
            <div className="hero-orb hero-orb-1"></div>
            <div className="hero-orb hero-orb-2"></div>
            <div className="hero-orb hero-orb-3"></div>
          </div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <div className="hero-badge-glow"></div>
              <Sparkles size={16} />
              <span>Plateforme de blog moderne</span>
              <div className="hero-badge-shine"></div>
            </div>
            <h1 className="hero-title">
              <span className="hero-title-line">Créez, partagez et</span>
              <span className="hero-title-highlight">
                <span className="hero-highlight-text">inspirez</span>
                <div className="hero-highlight-bg"></div>
              </span>
              <span className="hero-title-line">avec vos idées</span>
            </h1>
            <div className="hero-actions">
              <Link to="/add-post" className="btn btn-primary hero-btn hero-btn-primary">
                <div className="btn-glow"></div>
                <PenTool size={20} />
                <span>Commencer à écrire</span>
                <ArrowRight size={16} className="btn-arrow" />
              </Link>
              <button 
                className="btn btn-secondary hero-btn hero-btn-secondary"
                onClick={() => document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen size={20} />
                <span>Explorer les articles</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <div className="hero-card-header">
                <div className="hero-card-avatar"></div>
                <div className="hero-card-info">
                  <div className="hero-card-name"></div>
                  <div className="hero-card-date"></div>
                </div>
              </div>
              <div className="hero-card-content">
                <div className="hero-card-line hero-card-line-1"></div>
                <div className="hero-card-line hero-card-line-2"></div>
                <div className="hero-card-line hero-card-line-3"></div>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <div className="hero-card-header">
                <div className="hero-card-avatar"></div>
                <div className="hero-card-info">
                  <div className="hero-card-name"></div>
                  <div className="hero-card-date"></div>
                </div>
              </div>
              <div className="hero-card-content">
                <div className="hero-card-line hero-card-line-1"></div>
                <div className="hero-card-line hero-card-line-2"></div>
              </div>
            </div>
            <div className="hero-floating-icons">
              <div className="hero-floating-icon hero-floating-icon-1">
                <Heart size={20} />
              </div>
              <div className="hero-floating-icon hero-floating-icon-2">
                <MessageCircle size={18} />
              </div>
              <div className="hero-floating-icon hero-floating-icon-3">
                <Eye size={16} />
              </div>
              <div className="hero-floating-icon hero-floating-icon-4">
                <Zap size={22} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Lecteurs actifs</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">500+</div>
                <div className="stat-label">Articles publiés</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">95%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Award size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">50+</div>
                <div className="stat-label">Auteurs experts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <Sparkles size={32} />
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="section-subtitle">
              Découvrez les fonctionnalités qui rendent notre plateforme unique et performante
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <PenTool size={32} />
              </div>
              <h3>Éditeur intuitif</h3>
              <p>Créez et éditez vos articles avec un éditeur moderne et facile à utiliser, conçu pour les créateurs de contenu.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Eye size={32} />
              </div>
              <h3>Visibilité maximale</h3>
              <p>Votre contenu est optimisé pour le référencement et la découverte par une communauté engagée de lecteurs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Heart size={32} />
              </div>
              <h3>Communauté active</h3>
              <p>Rejoignez une communauté passionnée d'auteurs et de lecteurs qui partagent vos centres d'intérêt.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Performance rapide</h3>
              <p>Bénéficiez d'une plateforme ultra-rapide avec des temps de chargement optimisés pour une expérience fluide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Ciblage précis</h3>
              <p>Atteignez votre audience cible grâce à notre système de tags et de catégories intelligent.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MessageCircle size={32} />
              </div>
              <h3>Interaction riche</h3>
              <p>Engagez vos lecteurs avec des commentaires, des likes et un système de feedback complet.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Articles Carousel */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div className="featured-badge">
              <Star size={20} />
              Articles Vedettes
            </div>
            <h2 className="featured-title">
              Découvrez nos <span className="gradient-text">contenus phares</span>
            </h2>
            <p className="featured-subtitle">
              Une sélection soignée de nos meilleurs articles par nos experts
            </p>
          </div>

          <div className="featured-carousel">
            <div className="carousel-container">
              <button className="carousel-btn carousel-prev" onClick={prevFeatured}>
                <ArrowRight size={24} style={{transform: 'rotate(180deg)'}} />
              </button>
              
              <div className="featured-card-main">
                <div className="featured-image">
                  <img 
                    src={featuredArticles[featuredIndex].image} 
                    alt={featuredArticles[featuredIndex].title}
                  />
                  <div className="featured-overlay">
                    <span className="featured-category">
                      {featuredArticles[featuredIndex].category}
                    </span>
                  </div>
                </div>
                <div className="featured-content">
                  <h3>{featuredArticles[featuredIndex].title}</h3>
                  <p>{featuredArticles[featuredIndex].excerpt}</p>
                  <div className="featured-meta">
                    <div className="featured-author">
                      <div className="author-avatar">
                        {featuredArticles[featuredIndex].author.charAt(0)}
                      </div>
                      <span>{featuredArticles[featuredIndex].author}</span>
                    </div>
                  </div>
                  <Link to={`/post/${featuredArticles[featuredIndex].id}`} className="featured-btn">
                    Lire l'article
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              <button className="carousel-btn carousel-next" onClick={nextFeatured}>
                <ArrowRight size={24} />
              </button>
            </div>

            <div className="carousel-indicators">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === featuredIndex ? 'active' : ''}`}
                  onClick={() => setFeaturedIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="articles-section" id="articles-section">
        <div className="container">
          {/* Enhanced Section Header */}
          <div className="articles-header">
            <div className="articles-title-wrapper">
              <div className="articles-badge">
                <BookOpen size={20} />
                <span>Découvrez</span>
              </div>
              <h2 className="articles-title">
                <span className="articles-title-main">Articles Récents</span>
                <span className="articles-title-accent">& Populaires</span>
              </h2>
              <p className="articles-subtitle">
                Explorez notre collection d'articles soigneusement sélectionnés par notre communauté
              </p>
            </div>
            
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="search-results-info">
                <div className="search-results-badge">
                  <Search size={16} />
                  <span>
                    {searchQuery && `Résultats pour "${searchQuery}"`}
                    {searchQuery && selectedCategory !== 'all' && ' • '}
                    {selectedCategory !== 'all' && `Catégorie: ${selectedCategory}`}
                  </span>
                  <button 
                    className="search-results-clear" 
                    onClick={() => {
                      handleSearch('');
                      setSelectedCategory('all');
                    }}
                    aria-label="Effacer les filtres"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* Modern Search and Filter Controls */}
          <div className="modern-search-controls">
            <div className="search-filter-container">
              <div className="search-section-modern">
                <div className="search-input-container">
                  <div className="search-icon-wrapper">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher par titre, contenu ou tags..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="modern-search-input"
                  />
                  {searchQuery && (
                    <button 
                      className="search-clear-modern" 
                      onClick={() => handleSearch('')}
                      aria-label="Effacer la recherche"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="search-suggestions-modern">
                  <span className="suggestions-label">Suggestions:</span>
                  <div className="suggestion-chips">
                    <button className="suggestion-chip" onClick={() => handleSearch('tech')}>
                      <span>Tech</span>
                    </button>
                    <button className="suggestion-chip" onClick={() => handleSearch('design')}>
                      <span>Design</span>
                    </button>
                    <button className="suggestion-chip" onClick={() => handleSearch('développement')}>
                      <span>Développement</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="filters-section-modern">
                <div className="sort-dropdown-modern">
                  <div className="sort-label-modern">
                    <ArrowUpDown size={16} />
                    <span>Trier par:</span>
                  </div>
                  <div className="sort-options-modern">
                    <button 
                      className={`sort-option-modern ${sortField === 'createdAt' ? 'active' : ''}`}
                      onClick={() => toggleSort('createdAt')}
                    >
                      <Calendar size={14} />
                      <span>Date</span>
                      <div className="sort-indicator">
                        <ArrowUpDown 
                          size={12} 
                          className={sortField === 'createdAt' && sortOrder === 'desc' ? 'rotated' : ''} 
                        />
                      </div>
                    </button>
                    <button 
                      className={`sort-option-modern ${sortField === 'title' ? 'active' : ''}`}
                      onClick={() => toggleSort('title')}
                    >
                      <BookOpen size={14} />
                      <span>Titre</span>
                      <div className="sort-indicator">
                        <ArrowUpDown 
                          size={12} 
                          className={sortField === 'title' && sortOrder === 'desc' ? 'rotated' : ''} 
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-container">
            <div className="error-content">
              <div className="error-icon-wrapper">
                <AlertCircle size={48} className="error-icon" />
              </div>
              <h3 className="error-title">Oups ! Une erreur s'est produite</h3>
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <button onClick={fetchPosts} className="btn btn-primary">
                  <ArrowUpDown size={16} />
                  Réessayer
                </button>
                <Link to="/" className="btn btn-secondary">
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-content">
              <LoadingSpinner size="large" />
              <h3 className="loading-title">Chargement en cours...</h3>
              <p className="loading-text">Nous préparons les meilleurs articles pour vous</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-container">
            <div className="empty-content">
              <div className="empty-icon-wrapper">
                <BookOpen size={64} className="empty-icon" />
                <div className="empty-sparkles">
                  <Sparkles size={20} />
                </div>
              </div>
              <h3 className="empty-title">
                {searchQuery ? 'Aucun résultat trouvé' : 'Prêt à commencer ?'}
              </h3>
              <p className="empty-message">
                {searchQuery 
                  ? `Nous n'avons trouvé aucun article correspondant à "${searchQuery}". Essayez avec d'autres mots-clés.`
                  : 'Soyez le premier à partager vos idées avec notre communauté !'}
              </p>
              <div className="empty-actions">
                {searchQuery ? (
                  <>
                    <button onClick={() => setSearchQuery('')} className="btn btn-primary">
                      <X size={16} />
                      Effacer la recherche
                    </button>
                    <Link to="/add-post" className="btn btn-secondary">
                      <PenTool size={16} />
                      Créer un article
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/add-post" className="btn btn-primary">
                      <PenTool size={16} />
                      Créer le premier article
                      <ArrowRight size={16} className="btn-arrow" />
                    </Link>
                    <button 
                      onClick={() => window.location.reload()}
                      className="btn btn-secondary"
                    >
                      <ArrowUpDown size={16} />
                      Actualiser
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            {/* Posts Results Header */}
            <div className="posts-results-header">
              <div className="posts-count">
                <span className="posts-count-number">{posts.length}</span>
                <span className="posts-count-text">
                  {posts.length === 1 ? 'article trouvé' : 'articles trouvés'}
                  {searchQuery && ` pour "${searchQuery}"`}
                </span>
              </div>
              <div className="posts-view-options">
                <span className="view-label">Affichage:</span>
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                  title="Vue grille"
                  onClick={() => handleViewModeChange('grid')}
                >
                  <div className="grid-icon">
                    <div></div><div></div><div></div><div></div>
                  </div>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                  title="Vue liste"
                  onClick={() => handleViewModeChange('list')}
                >
                  <div className="list-icon">
                    <div></div><div></div><div></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Beautiful Posts Grid */}
            <div className={`posts-container ${viewMode === 'list' ? 'posts-list-view' : 'posts-grid-beautiful'}`}>
              {posts.map((post, index) => (
                <article 
                  key={post._id} 
                  className={`beautiful-post-card ${viewMode === 'list' ? 'list-mode' : ''}`}
                  style={{'--delay': `${index * 0.1}s`}}
                >
                  <div className="card-image-container">
                    <img 
                      src={`https://picsum.photos/400/250?random=${post._id}`} 
                      alt={post.title}
                      className="card-image"
                    />
                    <div className="card-gradient-overlay"></div>
                    <div className="card-category-badge">
                      {post.tags && post.tags[0] ? post.tags[0] : 'Article'}
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">
                        <Link to={`/post/${post._id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="card-excerpt">
                        {post.content.substring(0, 120)}...
                      </p>
                    </div>

                    <div className="card-meta">
                      <div className="card-author">
                        <div className="author-avatar">
                          {post.author ? post.author.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="author-info">
                          <span className="author-name">
                            {post.author || 'Auteur Anonyme'}
                          </span>
                          <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="card-actions">
                      <Link to={`/post/${post._id}`} className="read-more-btn">
                        Lire l'article
                        <ArrowRight size={16} />
                      </Link>
                      <div className="card-quick-actions">
                        <Link to={`/edit-post/${post._id}`} className="action-btn edit-btn" title="Modifier">
                          <Edit size={16} />
                        </Link>
                        <button 
                          className="action-btn delete-btn" 
                          title="Supprimer"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="card-tags">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="card-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            
            {/* Load More Section */}
            {hasMorePosts && (
              <div className="load-more-section">
                <button 
                  className="load-more-btn"
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="loading-spinner"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={20} style={{transform: 'rotate(90deg)'}} />
                      Charger plus d'articles
                    </>
                  )}
                </button>
                <div className="load-more-info">
                  <span>{posts.length} articles affichés</span>
                </div>
              </div>
            )}

            {!hasMorePosts && posts.length > 0 && (
              <div className="end-of-posts">
                <div className="end-message">
                  <Sparkles size={24} />
                  <span>Vous avez vu tous nos articles !</span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <Star size={32} />
              Ce que disent nos utilisateurs
            </h2>
            <p className="section-subtitle">
              Découvrez les témoignages de notre communauté d'auteurs et de lecteurs
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>"Cette plateforme a révolutionné ma façon d'écrire et de partager mes idées. L'interface est intuitive et la communauté est incroyable !"</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <span>M</span>
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Marie Dubois</div>
                  <div className="testimonial-role">Auteure Tech</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>"J'ai trouvé ici une communauté passionnée qui m'inspire chaque jour. Les articles sont de qualité exceptionnelle."</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <span>A</span>
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Ahmed Benali</div>
                  <div className="testimonial-role">Lecteur assidu</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>"L'éditeur est fantastique et les fonctionnalités de collaboration rendent l'écriture encore plus agréable."</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <span>S</span>
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Sophie Martin</div>
                  <div className="testimonial-role">Blogueuse lifestyle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
