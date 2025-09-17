import axios from 'axios';

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for multipart/form-data (file uploads)
const uploadApi = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for upload API calls
uploadApi.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Do not set Content-Type as it will be set automatically with the correct boundary
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    // Handle different error statuses
    if (response && response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (response && response.status === 404) {
      console.error('Resource not found');
    } else if (response && response.status === 500) {
      console.error('Server error');
    } else if (!response) {
      console.error('Network error - make sure API is running');
    }
    return Promise.reject(error);
  }
);

// Response interceptor for upload API calls
uploadApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    // Handle different error statuses
    if (response && response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (response && response.status === 404) {
      console.error('Resource not found');
    } else if (response && response.status === 500) {
      console.error('Server error');
    } else if (!response) {
      console.error('Network error - make sure API is running');
    }
    return Promise.reject(error);
  }
);

// Posts API
const postsAPI = {
  // Get all posts with optional filtering, pagination, and sorting
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a single post by ID
  getPostById: async (id) => {
    // Validate ID before making the request
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid post ID:', id);
      throw new Error('Invalid post ID');
    }
    
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      // Check if postData is FormData (contains file) or regular object
      let response;
      if (postData instanceof FormData) {
        response = await uploadApi.post('/posts', postData);
      } else {
        response = await api.post('/posts', postData);
      }
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    try {
      // Check if postData is FormData (contains file) or regular object
      let response;
      if (postData instanceof FormData) {
        response = await uploadApi.put(`/posts/${id}`, postData);
      } else {
        response = await api.put(`/posts/${id}`, postData);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }
};

// Comments API
const commentsAPI = {
  // Get comments for a post
  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },

  // Add a comment to a post
  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/comments/post/${postId}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId, content) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  }
};

// Likes API
const likesAPI = {
  // Get likes for a post
  getLikesByPostId: async (postId) => {
    try {
      const response = await api.get(`/likes/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      throw error;
    }
  },

  // Toggle like for a post
  toggleLike: async (postId) => {
    try {
      const response = await api.post(`/likes/post/${postId}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling like for post ${postId}:`, error);
      throw error;
    }
  },

  // Get posts liked by current user
  getLikedPosts: async () => {
    try {
      const response = await api.get('/likes/user/liked');
      return response.data;
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      throw error;
    }
  }
};

// Bookmarks API
const bookmarksAPI = {
  // Check if a post is bookmarked
  checkBookmark: async (postId) => {
    try {
      const response = await api.get(`/bookmarks/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error checking bookmark for post ${postId}:`, error);
      throw error;
    }
  },

  // Toggle bookmark for a post
  toggleBookmark: async (postId) => {
    try {
      const response = await api.post(`/bookmarks/post/${postId}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling bookmark for post ${postId}:`, error);
      throw error;
    }
  },

  // Get bookmarked posts
  getBookmarkedPosts: async () => {
    try {
      const response = await api.get('/bookmarks/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarked posts:', error);
      throw error;
    }
  }
};

// Named exports for easier importing
export const getPosts = postsAPI.getPosts;
export const getPostById = postsAPI.getPostById;
export const createPost = postsAPI.createPost;
export const updatePost = postsAPI.updatePost;
export const deletePost = postsAPI.deletePost;

// Comment exports
export const getCommentsByPostId = commentsAPI.getCommentsByPostId;
export const addComment = commentsAPI.addComment;
export const updateComment = commentsAPI.updateComment;
export const deleteComment = commentsAPI.deleteComment;

// Like exports
export const getLikesByPostId = likesAPI.getLikesByPostId;
export const toggleLike = likesAPI.toggleLike;
export const getLikedPosts = likesAPI.getLikedPosts;

// Bookmark exports
export const checkBookmark = bookmarksAPI.checkBookmark;
export const toggleBookmark = bookmarksAPI.toggleBookmark;
export const getBookmarkedPosts = bookmarksAPI.getBookmarkedPosts;

export default {
  posts: postsAPI,
  comments: commentsAPI,
  likes: likesAPI,
  bookmarks: bookmarksAPI
};
