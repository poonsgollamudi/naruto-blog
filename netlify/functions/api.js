// Netlify serverless function for basic API endpoints
// This allows some dynamic functionality on Netlify

export default async (req, context) => {
  const { httpMethod, path, body } = req;

  // Handle different API endpoints
  if (path === '/api/health') {
    return new Response(JSON.stringify({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      platform: 'Netlify Functions'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Handle contact form or comments (future feature)
  if (path === '/api/contact' && httpMethod === 'POST') {
    try {
      const data = JSON.parse(body);
      
      // Here you could integrate with:
      // - Netlify Forms
      // - Email service (SendGrid, etc.)
      // - External database
      
      console.log('Contact form submission:', data);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Thank you for your message!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Default 404 response
  return new Response(JSON.stringify({ 
    error: 'Endpoint not found'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};