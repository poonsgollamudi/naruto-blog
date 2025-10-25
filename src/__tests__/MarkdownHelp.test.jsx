import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MarkdownHelp from '../components/MarkdownHelp'
import React from 'react'

test('shows markdown shortcuts', () => {
  render(<MarkdownHelp />)
  
  // Check for basic markdown syntax examples
  expect(screen.getByText('Bold text')).toBeInTheDocument()
  expect(screen.getByText('Italic text')).toBeInTheDocument()
  expect(screen.getByText('Link')).toBeInTheDocument()
  
  // Check for keyboard shortcuts
  expect(screen.getByText('Ctrl + B')).toBeInTheDocument()
  expect(screen.getByText('Ctrl + I')).toBeInTheDocument()
})

test('shows example markdown syntax', () => {
  render(<MarkdownHelp />)
  
  // Check that code examples are shown
  expect(screen.getByText('**text**')).toBeInTheDocument() // bold
  expect(screen.getByText('*text*')).toBeInTheDocument() // italic
  expect(screen.getByText('# text')).toBeInTheDocument() // heading
})