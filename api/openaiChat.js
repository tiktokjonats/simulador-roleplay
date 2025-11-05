// api/openaiChat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Llamada a OpenAI con tu clave segura
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}` // <-- La que guardaste en Vercel
      },
      body: JSON.stringify({
        model: body.model || 'gpt-4o-mini',
        messages: body.messages || [],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI error:', data.error);
      return res.status(400).json({ error: data.error });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Error servidor OpenAI:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}
