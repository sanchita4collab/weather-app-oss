const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());

// Serve static files from docs/
app.use(express.static(path.join(__dirname, 'docs')));

// AI Quote endpoint (server-side to keep API key secret)
app.post('/api/ai-quote', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not set on server.' });
    }

    const { weather, temperature } = req.body || {};
    const cond = typeof weather === 'string' && weather.trim() ? weather.trim() : 'Unknown';
    const tempC = Number.isFinite(temperature) ? Math.round(temperature) : null;

    const prompt = [
      `Weather: ${cond}`,
      `Temperature: ${tempC != null ? `${tempC}°C` : 'Unknown'}`,
      '',
      'Generate a short motivational quote that matches this weather.',
      'Keep it positive and calm.',
      'Constraints: 1–2 sentences, <= 25 words, no emojis, no hashtags, no lists.'
    ].join('\n');

    const client = new OpenAI({ apiKey });
    const resp = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      max_output_tokens: 80,
      temperature: 0.6
    });

    const text = resp.output_text || '';
    return res.json({ quote: text.trim() });
  } catch (err) {
    console.error('AI quote error:', err);
    return res.status(500).json({ error: err.message || 'AI error' });
  }
});

// Fallback to index.html for direct navigations
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
