import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyBp48KoJ0POnK2-VXsvtiF9CiUfCFVLBRg";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const userInput = req.query.input || 'Hello, how are you today?';

      const chatSession = model.startChat({
        generationConfig,
        history: [
          // Add any initial conversation history if needed
        ],
      });

      const result = await chatSession.sendMessage(userInput);

      // Send the response as a JSON object
      res.status(200).json({ response: result.response.text() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
