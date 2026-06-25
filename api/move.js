export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GROQ_API_KEY. Set it in Vercel → Settings → Environment Variables." });
  }

  try {
    const { messages } = req.body;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.2,
        max_tokens: 24
      })
    });

    const data = await groqRes.json();
    return res.status(groqRes.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Proxy error: " + String(err) });
  }
}
