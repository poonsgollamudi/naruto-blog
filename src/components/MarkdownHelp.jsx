import React from 'react'

const shortcuts = [
  { key: 'Ctrl + B', description: 'Bold text', example: '**text**' },
  { key: 'Ctrl + I', description: 'Italic text', example: '*text*' },
  { key: 'Ctrl + K', description: 'Link', example: '[text](url)' },
  { key: 'Ctrl + Shift + V', description: 'Preview toggle' },
  { key: '#', description: 'Heading 1', example: '# text' },
  { key: '##', description: 'Heading 2', example: '## text' },
  { key: '-', description: 'List item', example: '- text' },
  { key: '1.', description: 'Numbered list', example: '1. text' },
  { key: '>', description: 'Quote', example: '> text' },
  { key: '```', description: 'Code block', example: '```\ncode\n```' }
]

export default function MarkdownHelp() {
  return (
    <div className="markdown-help">
      <h4>Markdown Shortcuts</h4>
      <div className="shortcuts-list">
        {shortcuts.map(({ key, description, example }) => (
          <div key={key} className="shortcut">
            <kbd>{key}</kbd>
            <span>{description}</span>
            {example && <code>{example}</code>}
          </div>
        ))}
      </div>
    </div>
  )
}