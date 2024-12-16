import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "",
});

async function testApiKey() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use any other available model if needed
      messages: [{ role: 'user', content: 'Hello, world!' }],
    });
    console.log('API Key is working! Response:', response);
  } catch (error) {
    console.error('Error with API Key:', error.message);
  }
}

testApiKey();