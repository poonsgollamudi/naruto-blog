import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CharacterTagSelector from '../components/CharacterTagSelector'
import React from 'react'

test('adds character tag when clicked', () => {
  const onSelect = vi.fn()
  render(<CharacterTagSelector currentTags="" onSelect={onSelect} />)
  
  // Find and click a character button (Naruto)
  const narutoBtn = screen.getByText('Naruto Uzumaki')
  fireEvent.click(narutoBtn)
  
  // Should call onSelect with the character name
  expect(onSelect).toHaveBeenCalledWith('naruto uzumaki')
})

test('shows character groups', () => {
  render(<CharacterTagSelector currentTags="" onSelect={() => {}} />)
  
  // Check that main groups are displayed
  expect(screen.getByText('Team 7')).toBeInTheDocument()
  expect(screen.getByText('Akatsuki')).toBeInTheDocument()
  expect(screen.getByText('Hokage')).toBeInTheDocument()
})

test('highlights active character tags', () => {
  render(<CharacterTagSelector currentTags="naruto uzumaki, sasuke uchiha" onSelect={() => {}} />)
  
  // Get the buttons and check their active state
  const narutoBtn = screen.getByText('Naruto Uzumaki')
  const sasukeBtn = screen.getByText('Sasuke Uchiha')
  const sakuraBtn = screen.getByText('Sakura Haruno')
  
  expect(narutoBtn).toHaveClass('active')
  expect(sasukeBtn).toHaveClass('active')
  expect(sakuraBtn).not.toHaveClass('active')
})