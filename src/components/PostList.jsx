import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import AddPost from './AddPost';
import '../styles.css';

export default function PostList({ showAddPost, setShowAddPost }) {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  // Load posts from backend on component mount
  useEffect(() => {
    fetchPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddPost = async (newPost) => {
    try {
      await postService.createPost(newPost);
      // Refresh the posts list after adding a new post
      await fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await postService.getAllPosts();
      setPosts(fetchedPosts);
      // Update activePost if it exists in the new data
      if (activePost) {
        const updatedActivePost = fetchedPosts.find(p => p._id === activePost._id);
        setActivePost(updatedActivePost || null);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      // If we're deleting the active post, clear it
      if (activePost?._id === postId) {
        setActivePost(null);
      }
      // Refresh the posts list
      await fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEditClick = (post, e) => {
    e.stopPropagation(); // Prevent setting activePost
    setEditingPost(post);
    setShowAddPost(true);
  };

  const handleEditPost = async (editedPost) => {
    try {
      await postService.updatePost(editedPost._id, editedPost);
      setEditingPost(null);
      // Refresh the posts list and update active post if needed
      await fetchPosts();
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  return (
    <div className="post-container">
      <div className="post-list">
        <h2>Naruto Blog Posts</h2>
        {showAddPost && (
          <AddPost 
            onAdd={editingPost ? handleEditPost : handleAddPost} 
            onClose={() => {
              setShowAddPost(false);
              setEditingPost(null);
            }}
            editPost={editingPost}
          />
        )}
        <div className="posts">
          {posts.map(post => (
            <div 
              key={post._id} 
              className={`post-item ${activePost?._id === post._id ? 'active' : ''}`}
              onClick={() => setActivePost(activePost?._id === post._id ? null : post)}
            >
              <h3>{post.title}</h3>
              <div className="post-meta">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                {post.tags && (
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="post-actions">
                <button onClick={(e) => handleEditClick(post, e)}>Edit</button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePost(post._id);
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activePost && (
        <div className="post-content">
          <h1>{activePost.title}</h1>
          <div className="content">{activePost.content}</div>
        </div>
      )}
    </div>
  )
}
