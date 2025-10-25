// Dynamic API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-railway-app.up.railway.app/api'  // Will update this after Railway deployment
    : 'http://localhost:5000/api');

export const postService = {
  // Get all posts
  async getAllPosts() {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  // Get single post
  async getPost(id) {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  // Create new post
  async createPost(postData) {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  // Update post
  async updatePost(id, postData) {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  },

  // Delete post
  async deletePost(id) {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return response.json();
  },
};