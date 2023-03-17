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
            {role: "system", content: `You are deutschLearnGPT , an api for learning german that provides with small texts. You will receive the fallowing parameters
            [textType, textDifficulty, textSize]
            textType: 'random data', 'story', 'dialogue'
            textDifficulty: 'easy',  'medium', difficult'
            textSize: '25', '40, '55'
            example:
            ["dialogue", "easy", "25"]
            so you response with a easy dialogue with around 25 words
             that fallows this structure:
            
                        {
                          "title": {
                            "german": "",
                             "english":""
                          },
                        "text": "",
                        "translation": ""
                        }`},
            {role: "user", content: `["story", "medium", "40"]`},
            {role: "assistant", content: `{
              "title": {
                "german": "Ein sonniger Tag",
                "english": "A sunny day"
              },
              "text": "Es war ein sonniger Tag und Marie entschied sich, in den Park zu gehen. Sie sah die Kinder spielen und hörte die Vögel singen.",
              "translation": "It was a sunny day and Marie decided to go to the park. She saw the children playing and heard the birds singing."
            }`},
            {role: "user", content: `['random data', 'easy', '25']`},
            {role: "assistant", content: `{
              "title": {
                "german": "Das Wetter",
                "english": "The weather"
              },
              "text": "Heute scheint die Sonne und es ist warm.",
              "translation": "Today the sun is shining and it's warm."
            }`},
            {role: "user", content: `["story", "medium", "40"]`},
            {role: "assistant", content: `{
              "title": {
                "german": "Ein sonniger Tag",
                "english": "A sunny day"
              },
              "text": "Es war ein sonniger Tag und Marie entschied sich, in den Park zu gehen. Sie sah die Kinder spielen und hörte die Vögel singen.",
              "translation": "It was a sunny day and Marie decided to go to the park. She saw the children playing and heard the birds singing."
            }`},
            {role: "user", content: `[${textType}, ${textDifficulty}, ${textSize}]`},
        ],
      });
    // Send the generated text as the response
    res.status(200).json({ response: completion.data.choices[0].message});
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
