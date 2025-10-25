require('dotenv').config();
const cron = require('node-cron');
const fetch = require('node-fetch');
const Post = require('./models/Post');
const mongoose = require('mongoose');

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
// Default prompt if none provided in env
const DEFAULT_PROMPT = process.env.AI_PROMPT || `Write a new Naruto-themed blog post in Markdown. Provide a short descriptive title, the full content in markdown (including headings and at least one paragraph), and 3 tags. Return the output as JSON with keys: title, content, tags (array).`;

async function generatePostFromAI(prompt) {
  // If Anthropic key present, prefer Anthropic Claude API (Messages API)
  if (ANTHROPIC_KEY) {
    const body = {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1200,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic error: ${res.status} ${text}`);
    }

    const data = await res.json();
    // New Messages API returns { content: [{ text: '...' }] }
    const raw = data.content?.[0]?.text;
    if (!raw) throw new Error('No content from Anthropic');

    let jsonText = raw.trim();
    if (jsonText.startsWith('```')) {
      const firstNewline = jsonText.indexOf('\n');
      const lastFence = jsonText.lastIndexOf('```');
      if (lastFence > firstNewline) jsonText = jsonText.substring(firstNewline+1, lastFence).trim();
    }

    try {
      return JSON.parse(jsonText);
    } catch (err) {
      const match = jsonText.match(/(\{[\s\S]*\})/);
      if (match) return JSON.parse(match[1]);
      throw err;
    }
  }

  // Fallback to OpenAI if available
  if (!OPENAI_KEY) throw new Error('No AI API key set in environment (OPENAI_API_KEY or ANTHROPIC_API_KEY)');

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that returns JSON only.' },
      { role: 'user', content: prompt + '\n\nRespond only with valid JSON.' }
    ],
    temperature: 0.8,
    max_tokens: 1200
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const raw = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!raw) throw new Error('No content from OpenAI');

  // Try parse JSON from response (strip surrounding markdown fences if any)
  let jsonText = raw.trim();
  // remove ```json or ``` fences
  if (jsonText.startsWith('```')) {
    const firstNewline = jsonText.indexOf('\n');
    const lastFence = jsonText.lastIndexOf('```');
    if (lastFence > firstNewline) jsonText = jsonText.substring(firstNewline+1, lastFence).trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    // fallback: attempt to extract JSON object within text
    const match = jsonText.match(/(\{[\s\S]*\})/);
    if (match) parsed = JSON.parse(match[1]);
    else throw err;
  }

  return parsed;
}

async function createPostFromPrompt(prompt) {
  try {
    // Wait for mongoose connection before saving
    if (mongoose.connection.readyState !== 1) {
      console.log('Waiting for MongoDB connection...');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('MongoDB connection timeout')), 30000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve();
        });
        if (mongoose.connection.readyState === 1) {
          clearTimeout(timeout);
          resolve();
        }
      });
    }

    const result = await generatePostFromAI(prompt);
    if (!result || !result.title || !result.content) {
      console.error('AI response malformed:', result);
      return;
    }

    const tags = Array.isArray(result.tags) ? result.tags : [];

    const post = new Post({
      title: result.title,
      content: result.content,
      tags,
      author: result.author || 'AI Writer'
    });

    await post.save();
    console.log('AI-generated post created:', post.title);
  } catch (err) {
    console.error('Failed to create AI post:', err);
  }
}

// Only start cron if explicitly enabled
if (process.env.ENABLE_SCHEDULER === 'true') {
  // Cron schedule: run every Sunday at 09:00 server time by default
  const SCHEDULE = process.env.SCHEDULE_CRON || '0 9 * * 0';

  console.log(`AI scheduler will run with cron: ${SCHEDULE}`);
  cron.schedule(SCHEDULE, () => {
    console.log('AI scheduler triggered at', new Date().toISOString());
    createPostFromPrompt(DEFAULT_PROMPT);
  }, {
    scheduled: true,
  });
} else {
  console.log('AI scheduler disabled (set ENABLE_SCHEDULER=true to enable)');
}

// Also export functions for manual trigger/testing
module.exports = {
  createPostFromPrompt,
  generatePostFromAI
};
