export default async function handler(req, res) {
  // 1. Get the original URL path
  // Vercel puts the path in req.url, e.g., "/v1beta/models/..."
  
  // 2. Define the Google Host
  const googleHost = "https://generativelanguage.googleapis.com";
  const fullUrl = googleHost + req.url;

  // 3. Prepare options (method, headers, body)
  const options = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (req.method === "POST" && req.body) {
    options.body = JSON.stringify(req.body);
  }

  try {
    // 4. Fetch from Google (Running in USA)
    const response = await fetch(fullUrl, options);
    const data = await response.json();

    // 5. Return result to you
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}