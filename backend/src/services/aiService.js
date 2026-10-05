const OpenAI = require('openai');

exports.summarizeAndTag = async (note) => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('AI features are not configured. Set OPENAI_API_KEY.');
    error.status = 503;
    throw error;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'Summarize the note and suggest up to 8 concise tags. Return only a JSON object with a string "summary" and a string array "tags".',
      },
      { role: 'user', content: JSON.stringify({ title: note.title, content: note.content }) },
    ],
  });

  const result = JSON.parse(response.choices[0]?.message?.content || '{}');
  if (typeof result.summary !== 'string' || !Array.isArray(result.tags)) {
    throw new Error('The AI service returned an invalid summary response.');
  }

  return {
    summary: result.summary,
    tags: result.tags.filter((tag) => typeof tag === 'string').slice(0, 8),
  };
};