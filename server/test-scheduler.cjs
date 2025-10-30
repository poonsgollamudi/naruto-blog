// Test script to manually trigger AI post generation
require('dotenv').config();
const mongoose = require('mongoose');
const { createPostFromPrompt } = require('./scheduler');

async function testScheduler() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Test the AI post generation
    console.log('Testing AI post generation...');
    await createPostFromPrompt('Write a short Naruto blog post about the power of friendship, focusing on Team 7. Include title, content, and tags as JSON.');
    
    console.log('Test completed!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testScheduler();