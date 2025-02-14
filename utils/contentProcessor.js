export async function processContent($) {
  try {
    // Extract main content
    const content = $('article, main, .content, .post, .entry-content')
      .first()
      .text()
      .trim();

    // Get summary from OpenAI
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Summarize this content in 3-4 sentences, focusing on the main points: ${content.substring(0, 1500)}`
        }]
      })
    });

    if (!summaryResponse.ok) {
      throw new Error('Failed to generate summary');
    }

    const summaryData = await summaryResponse.json();
    return summaryData.choices[0].message.content;

  } catch (error) {
    console.error('Error processing content:', error);
    throw error;
  }
}