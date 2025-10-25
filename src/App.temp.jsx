import React, { useState } from 'react'
import PostList from './components/PostList'
import HeroBackground from './components/HeroBackground'

export default function App() {
  const [showAddPost, setShowAddPost] = useState(false)

  return (
    <div className="app">
      <HeroBackground />
      <div className="content">
        <header>
          <h1>Naruto Blog</h1>
          <button 
            className="add-post-button"
            onClick={() => setShowAddPost(true)}
          >
            Add New Post
          </button>
        </header>
        <main>
          <PostList />
        </main>
      </div>
    </div>
  )
}