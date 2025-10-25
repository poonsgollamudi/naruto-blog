import React, { useState, useRef } from 'react'
import CharacterTagSelector from './CharacterTagSelector'
import MarkdownHelp from './MarkdownHelp'
import './AddPost.css'

export default function AddPost({ onAdd, onClose, editPost = null }) {
  const [title, setTitle] = useState(editPost ? editPost.title : '')
  const [tags, setTags] = useState(editPost ? editPost.tags.join(', ') : '')
  const [content, setContent] = useState(editPost ? editPost.content : '')
  const [showHelp, setShowHelp] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState('')
  const titleInputRef = useRef(null)
  const contentRef = useRef(null)
  const floatingToolbarRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const postData = {
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    if (editPost) {
      postData._id = editPost._id
      postData.date = editPost.date
    } else {
      postData.date = new Date().toISOString()
    }

    onAdd(postData)
    onClose() // Close the modal after submission
    
    // Reset form
    setTitle('')
    setTags('')
    setContent('')
  }

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose()
    }
  }

  const insertEmoji = (emoji) => {
    // Insert into title if title input is focused, otherwise into content
    const activeElement = document.activeElement
    
    if (activeElement && activeElement.id === 'title') {
      const currentTitle = title
      const cursorPosition = activeElement.selectionStart
      const newTitle = currentTitle.slice(0, cursorPosition) + emoji + currentTitle.slice(cursorPosition)
      setTitle(newTitle)
      
      // Restore cursor position
      setTimeout(() => {
        activeElement.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length)
      }, 0)
    } else {
      // Insert into content textarea at cursor position
      const textarea = contentRef.current
      if (textarea) {
        const cursorPosition = textarea.selectionStart
        const newContent = content.slice(0, cursorPosition) + emoji + content.slice(cursorPosition)
        setContent(newContent)
        
        // Restore cursor position
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length)
        }, 0)
      } else {
        // Fallback: append to end
        setContent(content + emoji)
      }
    }
  }

  const insertFormatting = (before, after = '') => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end)
    
    let newText
    let newCursorPos

    if (selectedText) {
      // Wrap selected text
      newText = content.slice(0, start) + before + selectedText + after + content.slice(end)
      newCursorPos = start + before.length + selectedText.length + after.length
    } else {
      // Insert formatting at cursor
      newText = content.slice(0, start) + before + after + content.slice(start)
      newCursorPos = start + before.length
    }

    setContent(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertHeading = (level) => {
    const hashes = '#'.repeat(level)
    insertFormatting(`${hashes} `, '\n')
  }

  const insertList = (ordered = false) => {
    const prefix = ordered ? '1. ' : '- '
    insertFormatting(prefix)
  }

  const insertLink = () => {
    insertFormatting('[', '](url)')
  }

  const insertImage = () => {
    insertFormatting('![alt text](', ')')
  }

  const insertCode = () => {
    insertFormatting('`', '`')
  }

  const insertCodeBlock = () => {
    insertFormatting('```\n', '\n```')
  }

  // Floating toolbar functionality
  const handleTextSelection = () => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.slice(start, end)

    if (selected.length > 0) {
      setSelectedText(selected)
      
      // Calculate toolbar position
      const rect = textarea.getBoundingClientRect()
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
      const scrollTop = textarea.scrollTop
      
      // Approximate position above selected text
      const x = rect.left + 10
      const y = rect.top - 50
      
      setToolbarPosition({ x, y })
      setShowFloatingToolbar(true)
    } else {
      setShowFloatingToolbar(false)
      setSelectedText('')
    }
  }

  const applyFloatingFormat = (before, after = '') => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    const newContent = content.slice(0, start) + before + selectedText + after + content.slice(end)
    setContent(newContent)
    
    setShowFloatingToolbar(false)
    setSelectedText('')
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length + after.length)
    }, 0)
  }

  const narutoEmojis = ['🍥', '🔥', '⚡', '🌟', '💫', '👊', '🦊', '🍃', '⛩️', '🥷']
  const commonEmojis = ['😀', '😊', '😎', '🤔', '😮', '😤', '😍', '🥳', '😢', '😡']
  const symbolEmojis = ['❤️', '💯', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⭐', '✨']

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>{editPost ? 'Edit Post' : 'Create New Post'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <div className="input-with-emoji">
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="Enter post title"
                ref={titleInputRef}
              />
              <button 
                type="button" 
                className="emoji-toggle"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add emoji"
              >
                😀
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated):</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="naruto, sasuke, etc."
            />
            <CharacterTagSelector currentTags={tags} onSelect={setTags} />
          </div>
          
          {showEmojiPicker && (
            <div className="emoji-picker">
              <div className="emoji-section">
                <h4>Naruto Theme</h4>
                <div className="emoji-grid">
                  {narutoEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className="emoji-btn"
                      onClick={() => insertEmoji(emoji)}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="emoji-section">
                <h4>Expressions</h4>
                <div className="emoji-grid">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className="emoji-btn"
                      onClick={() => insertEmoji(emoji)}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="emoji-section">
                <h4>Symbols</h4>
                <div className="emoji-grid">
                  {symbolEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className="emoji-btn"
                      onClick={() => insertEmoji(emoji)}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="content-header">
              <label>Content:</label>
              <div className="content-controls">
                <button 
                  type="button" 
                  className="emoji-toggle"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add emoji"
                >
                  😀
                </button>
                <button 
                  type="button" 
                  className="help-toggle"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  {showHelp ? 'Hide Help' : 'Show Markdown Help'}
                </button>
              </div>
            </div>
            {showHelp && <MarkdownHelp />}
            
            {/* Quick Insert Toolbar */}
            <div className="quick-toolbar">
              <div className="quick-toolbar-group">
                <span className="toolbar-label">Quick Insert:</span>
                <button type="button" onClick={() => insertHeading(1)} title="Heading 1" className="quick-btn">
                  H1
                </button>
                <button type="button" onClick={() => insertHeading(2)} title="Heading 2" className="quick-btn">
                  H2
                </button>
                <button type="button" onClick={() => insertList(false)} title="Bullet List" className="quick-btn">
                  • List
                </button>
                <button type="button" onClick={() => insertLink()} title="Link" className="quick-btn">
                  🔗 Link
                </button>
                <button type="button" onClick={() => insertCodeBlock()} title="Code Block" className="quick-btn">
                  &lt;/&gt; Code
                </button>
              </div>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              placeholder="Write your post content here... Select text to see formatting options!"
              rows={15}
              ref={contentRef}
              className="content-textarea"
            />
            
            {/* Floating Toolbar */}
            {showFloatingToolbar && (
              <div 
                className="floating-toolbar"
                ref={floatingToolbarRef}
                style={{
                  position: 'fixed',
                  left: toolbarPosition.x,
                  top: toolbarPosition.y,
                  zIndex: 1001
                }}
              >
                <button onClick={() => applyFloatingFormat('**', '**')} title="Bold" className="floating-btn">
                  <strong>B</strong>
                </button>
                <button onClick={() => applyFloatingFormat('*', '*')} title="Italic" className="floating-btn">
                  <em>I</em>
                </button>
                <button onClick={() => applyFloatingFormat('`', '`')} title="Code" className="floating-btn">
                  &lt;/&gt;
                </button>
                <button onClick={() => applyFloatingFormat('~~', '~~')} title="Strikethrough" className="floating-btn">
                  <s>S</s>
                </button>
                <button onClick={() => applyFloatingFormat('[', '](url)')} title="Link" className="floating-btn">
                  🔗
                </button>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
            <button type="submit" className="save">Save Post</button>
          </div>
        </form>
      </div>
    </div>
  )
}