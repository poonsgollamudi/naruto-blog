import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import PostList from '../components/PostList'
import React from 'react'

// Import and mock the postService
import { postService } from '../services/postService'

vi.mock('../services/postService', () => ({
  postService: {
    getAllPosts: vi.fn().mockResolvedValue([{
      _id: '1',
      title: 'Naruto & Sasuke — Rivalry and Growth',
      content: 'Test content',
      date: new Date().toISOString(),
      tags: ['naruto', 'sasuke']
    }]),
    deletePost: vi.fn().mockResolvedValue({ message: 'Post deleted' }),
    updatePost: vi.fn().mockResolvedValue({
      _id: '1',
      title: 'Updated Title',
      content: 'Updated content',
      date: new Date().toISOString(),
      tags: ['updated']
    })
  }
}))

test('shows edit and delete buttons for posts', async () => {
  const setShowAddPost = vi.fn()
  render(<PostList showAddPost={false} setShowAddPost={setShowAddPost} />)
  
  // Wait for post to appear and click it
  const post = await screen.findByText('Naruto & Sasuke — Rivalry and Growth')
  expect(post).toBeInTheDocument()
  
  // Edit and delete buttons should be visible
  expect(screen.getByText(/edit/i)).toBeInTheDocument()
  expect(screen.getByText(/delete/i)).toBeInTheDocument()
})

test('can edit a post', async () => {
  const setShowAddPost = vi.fn()
  render(<PostList showAddPost={true} setShowAddPost={setShowAddPost} />)
  
  // Wait for post to appear
  await screen.findByText('Naruto & Sasuke — Rivalry and Growth')
  
  // Click edit button
  fireEvent.click(screen.getByText(/edit/i))
  
  // Fill in new values  
  const titleInput = screen.getByLabelText(/^title:$/i)
  fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
  
  // Save changes
  fireEvent.click(screen.getByText(/save/i))
  
  // Should call updatePost
  expect(postService.updatePost).toHaveBeenCalled()
})

test('can delete a post', async () => {
  const setShowAddPost = vi.fn()
  render(<PostList showAddPost={false} setShowAddPost={setShowAddPost} />)
  
  // Wait for post to appear
  await screen.findByText('Naruto & Sasuke — Rivalry and Growth')
  
  // Click delete button
  fireEvent.click(screen.getByText(/delete/i))
  
  // Should call deletePost
  expect(postService.deletePost).toHaveBeenCalled()
})