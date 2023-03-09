import { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai';

interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    choices: {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }
  


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
            {role: "user", content: `i need you to provide me with a ${textType} that must have a ${textDifficulty} difficulty and must be ${textSize} size.

            the answer must fallow this structure for your answer, i dont need Translation or anything else:
            
            {
              "title": {
                "german": "",
                 "english":""
              },
            "text": "",

            }`},
        ],
      });
    // Send the generated text as the response
    res.status(200).json({ response: completion.data.choices[0].message});
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
