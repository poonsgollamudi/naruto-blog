export function getHeroImage(query) {
  if (!query) query = 'naruto'
  const q = encodeURIComponent(query)
  // Unsplash source provides a simple way to fetch a featured image for a query without API keys
  return `https://source.unsplash.com/1200x630/?${q}`
}