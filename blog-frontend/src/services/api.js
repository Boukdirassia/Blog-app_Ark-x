import axios from 'axios';

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed in the future
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
    if (response && response.status === 404) {
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
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
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

// Named exports for easier importing
export const getPosts = postsAPI.getPosts;
export const getPostById = postsAPI.getPostById;
export const createPost = postsAPI.createPost;
export const updatePost = postsAPI.updatePost;
export const deletePost = postsAPI.deletePost;

export default postsAPI;
