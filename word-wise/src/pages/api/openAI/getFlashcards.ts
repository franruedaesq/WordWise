import { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

// Define types for the request body and response data
interface RequestBody {
    text: string;
    id: string;
}

interface ResponseData {
  response: ChatCompletionResponseMessage | undefined;
  id: string;
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
  const { text, id } = req.body as RequestBody;
  try {
    // Generate text using GPT-3.5 Turbo model
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: `Act as you were an endpoint for german-english translation API, as an endpoint you get a text in german and then response with an array containing all of the words from the text translated to english. The list must include all the words used in the text and should not contain any repetitions. The structure of your response are as fallowed:
            {
            "flashcards": [
            {
            "id": "1",
            "front": "",
            "back": "",
            },
            {
            id: "2",
            "front": "",
            "back": "",
            },
            ...
            ]
            }
             you answer only with that structure and nothing else since you are an API endpoint
            as an endpoint if you don't get any Parameters then you response with an empty object: {}`},
            {role: "user", content: text },
        ],
      });
    // Send the generated text as the response
    res.status(200).json({ response: completion.data.choices[0].message, id});
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
