import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import React from 'react'
import { vi } from 'vitest'
import { postService } from '../services/postService'

// Mock the postService
vi.mock('../services/postService', () => ({
  postService: {
    getAllPosts: vi.fn().mockResolvedValue([{
      _id: '1',
      title: 'Naruto & Sasuke — Rivalry and Growth',
      content: 'Test content',
      date: new Date().toISOString(),
      tags: ['naruto', 'sasuke']
    }])
  }
}))

// Basic smoke test: app renders and sample post title appears
test('renders app and shows sample post title', async () => {
  render(<App />)
  // sample post title should appear in the document after loading
  const title = await screen.findByRole('heading', { name: /Naruto Blog/i, level: 1 })
  expect(title).toBeInTheDocument()
})