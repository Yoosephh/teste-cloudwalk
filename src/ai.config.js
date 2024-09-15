import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askLLM(query, matchData) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  
      messages: [
        {
          role: 'system',
          content: `You are an expert game analyst. You are provided with the following match data: ${JSON.stringify(matchData)}. Answer any user queries based on this data.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error querying GPT:', error);
    return 'Error processing the query.';
  }
}
