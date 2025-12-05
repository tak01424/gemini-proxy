export default async function handler(req, res) {
  // --- 1. HANDLE CORS (The Fix) ---
  // This tells the browser/app: "It is okay to talk to this server."
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any app to connect
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-goog-api-key');

  // If the app is just asking "Can I connect?" (OPTIONS request), say YES and stop.
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- 2. PREPARE URL ---
  const googleBase = "https://generativelanguage.googleapis.com";
  const targetUrl = new URL(googleBase + req.url);
  
  // Remove Vercel's internal path tracking
  targetUrl.searchParams.delete("path");

  // --- 3. PREPARE FETCH OPTIONS ---
  const options = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Forward the body if it's a POST request
  if (req.method === "POST" && req.body) {
    // Vercel parses JSON automatically, so we must stringify it back for Google
    options.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
  }

  try {
    // --- 4. CALL GOOGLE ---
    const response = await fetch(targetUrl.toString(), options);
    
    // Parse the response
    const data = await response.json();

    // --- 5. RETURN RESULT ---
    // Forward the status code from Google (200, 400, 500, etc.)
    res.status(response.status).json(data);

  } catch (error) {
    // Handle server crashes
    res.status(500).json({ error: error.message });
  }
}