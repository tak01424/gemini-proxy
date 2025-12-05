export default async function handler(req, res) {
  // 1. Construct the Google API URL based on the incoming request
  const googleBase = "https://generativelanguage.googleapis.com";
  
  // We use the 'new URL' object to easily manage query parameters
  // 'req.url' includes the path and the query string (e.g., /v1beta/models...?key=AIza...)
  const targetUrl = new URL(googleBase + req.url);

  // 2. CRITICAL FIX: Remove the 'path' parameter that Vercel adds
  targetUrl.searchParams.delete("path");
  
  // 3. Set up the fetch options
  const options = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // If there is a body (data), pass it along
  if (req.method === "POST" && req.body) {
    options.body = JSON.stringify(req.body);
  }

  try {
    // 4. Fetch from Google
    const response = await fetch(targetUrl.toString(), options);
    const data = await response.json();

    // 5. Return the response to your app
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}