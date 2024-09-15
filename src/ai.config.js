import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in an environment variable
});

const openai = new OpenAIApi(configuration);

export async function askLLM(query, matchData) {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: `Using the following match data:\n${JSON.stringify(matchData)}\nAnswer the following question:\n"${query}"`,
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error querying GPT:', error);
    return 'Error processing the query.';
  }
}
