import React, { useState } from 'react'
import PostList from './components/PostList'
import HeroBackground from './components/HeroBackground'

export default function App() {
  const [showAddPost, setShowAddPost] = useState(false)

  return (
    <div className="app">
      <HeroBackground />
      <div className="content">
        <header className="app-header">
          <h1>Naruto Blog</h1>
          <button 
            className="add-post-button"
            onClick={() => setShowAddPost(true)}
          >
            Add New Post
          </button>
        </header>
        <main className="app-main">
          <PostList showAddPost={showAddPost} setShowAddPost={setShowAddPost} />
        </main>
      </div>
      <style>{`
        .app {
          min-height: 100vh;
          position: relative;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(255, 140, 0, 0.3);
        }

        .app-header h1 {
          font-size: 2.5rem;
          font-weight: bold;
          color: #ff8c00;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          margin: 0;
        }

        .add-post-button {
          background-color: #ff8c00;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .add-post-button:hover {
          background-color: #ff7300;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .add-post-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .app-main {
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        @media (max-width: 768px) {
          .content {
            padding: 1rem;
          }

          .app-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .app-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}