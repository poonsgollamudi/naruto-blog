import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddPost from '../components/AddPost'
import React from 'react'
import { vi } from 'vitest'
import { postService } from '../services/postService'

// Mock the postService
vi.mock('../services/postService', () => ({
  postService: {
    createPost: vi.fn().mockResolvedValue({
      _id: '1',
      title: 'Test Post',
      content: 'Test content',
      date: new Date().toISOString(),
      tags: ['test']
    })
  }
}))

test('renders add post form', () => {
  const onAdd = vi.fn()
  const onClose = vi.fn()
  render(<AddPost onAdd={onAdd} onClose={onClose} />)
  
  expect(screen.getByLabelText(/^title:$/i)).toBeInTheDocument()
  expect(screen.getByText(/^content:$/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/^tags \(comma-separated\):$/i)).toBeInTheDocument()
})

test('submits form data correctly', async () => {
  const onAdd = vi.fn()
  const onClose = vi.fn()
  render(<AddPost onAdd={onAdd} onClose={onClose} />)
  
  fireEvent.change(screen.getByLabelText(/^title:$/i), {
    target: { value: 'Test Post' }
  })
  
  // Find the MDEditor's textarea by its unique classes and attributes
  const mdEditorTextarea = screen.getByRole('textbox', { 
    hidden: true, 
    name: '' // Empty name since it's internal to MDEditor
  })
  fireEvent.change(mdEditorTextarea, {
    target: { value: 'Test content' }
  })
  
  fireEvent.change(screen.getByLabelText(/^tags \(comma-separated\):$/i), {
    target: { value: 'test, naruto' }
  })
  
  fireEvent.click(screen.getByText(/save/i))
  
  expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({
    title: 'Test Post',
    content: 'Test content',
    tags: ['test', 'naruto']
  }))
})