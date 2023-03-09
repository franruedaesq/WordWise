import { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

// Define types for the request body and response data
interface RequestBody {
  textType: string;
  textSize: string;
  textDifficulty: string;
}

interface ResponseData {
  response: ChatCompletionResponseMessage | undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Make sure the request method is POST
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }

  // Parse the request body as JSON
  const { textType, textSize, textDifficulty } = req.body as RequestBody;
  try {
    // Generate text using GPT-3.5 Turbo model
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You are german writer and language investigator, you work for a publishing house writing dialogues, stories and texts in german for german language learning books."},
            {role: "user", content: `i need you to provide me with a ${textType} that must have a ${textDifficulty} difficulty and must be around ${textSize} size.

            the answer must fallow this structure, i dont need anything else, just answer with the correct this structure:
            
            {
              "title": {
                "german": "",
                 "english":""
              },
            "text": "",

            }
            
            this is an example of what you will answer:

            {
              "title": {
                "german": "Der Waldspaziergang",
                "english": "El paseo por el bosque",
              },
              "text": "Es war einmal ein kleiner Bär namens Bruno. Er wohnte in einem gemütlichen Haus am Rande des Waldes. Eines Tages beschloss er, einen Spaziergang durch den Wald zu machen...",
            },

            `
          },
        ],
      });
    // Send the generated text as the response
    res.status(200).json({ response: completion.data.choices[0].message});
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
