import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroBackground from '../components/HeroBackground'
import React from 'react'

test('renders hero background with parallax elements', () => {
  const { container } = render(<HeroBackground />)
  
  // Check that background elements exist
  expect(container.querySelector('.hero-background')).toBeInTheDocument()
  expect(container.querySelector('.parallax-bg')).toBeInTheDocument()
  expect(container.querySelector('.hero-overlay')).toBeInTheDocument()
})