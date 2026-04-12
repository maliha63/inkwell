

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.VITE_NEWS_API_KEY || process.env.NEWS_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'News API key not configured' })
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=3&apiKey=${apiKey}`
    )
    const data = await response.json()

    // Cache for 15 minutes on Vercel's edge — reduces API calls
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate')
    res.setHeader('Access-Control-Allow-Origin', '*')

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch news' })
  }
}
