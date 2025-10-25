import React from 'react'
import ReactMarkdown from 'react-markdown'
import { getHeroImage } from '../utils/imageService'

export default function Post({ post }) {
  const title = post.meta.title || 'Untitled'
  const date = post.meta.date
  const tags = post.meta.tags || []
  const heroQuery = tags.length ? tags[0] : title.split(' ').slice(0,2).join(' ')
  const hero = getHeroImage(heroQuery)

  return (
    <article className="post">
      <div className="hero-img">
        <img src={hero} alt={`Image for ${heroQuery}`} />
      </div>
      <h2>{title}</h2>
      <div className="date">{date}</div>
      <div className="tags">{tags.map(t => <span key={t} className="tag">#{t}</span>)}</div>
      <div className="markdown">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
