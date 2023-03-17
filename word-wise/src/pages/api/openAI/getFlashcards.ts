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
            {role: "system", content: `You are deutschTranslateGPT a german-english translation API, as an endpoint you get a text in german and then response with an array containing all of the words from the text translated to english. The list must include all the words used in the text and should not contain any repetitions. The structure of your response are as fallowed:
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
you must fallow this rules
- only answer with an object
- no word repetition
- no includes persons Names`},
            {role: "user", content: 'Ich lade dich zum Essen ein, kommst du morgen?.' },
            {role: "assistant", content: `{
              "flashcards": [
              {
              "id": "1",
              "front": "Ich",
              "back": "I"
              },
              {
              "id": "2",
              "front": "lade",
              "back": "invite"
              },
              {
              "id": "3",
              "front": "dich",
              "back": "you"
              },
              {
              "id": "4",
              "front": "zum",
              "back": "to the"
              },
              {
              "id": "5",
              "front": "Essen",
              "back": "meal"
              },
              {
              "id": "6",
              "front": "ein",
              "back": "in"
              },
              {
              "id": "7",
              "front": "kommst",
              "back": "come"
              },
              {
              "id": "8",
              "front": "du",
              "back": "you"
              },
              {
              "id": "9",
              "front": "morgen",
              "back": "tomorrow"
              }
              ]
              }` },
              {role: "user", content: 'Guten Morgen Julian! Wie geht es dir?' },
              {role: "assistant", content: `{
                "flashcards": [
                {
                "id": "1",
                "front": "Guten",
                "back": "Good"
                },
                {
                "id": "2",
                "front": "Morgen!",
                "back": "morning!"
                },
                {
                "id": "3",
                "front": "Wie",
                "back": "How"
                },
                {
                "id": "4",
                "front": "geht",
                "back": "are"
                },
                {
                "id": "5",
                "front": "es",
                "back": "you"
                },
                {
                "id": "6",
                "front": "dir?",
                "back": "doing?"
                }
                ]
                }` },
                {role: "user", content: 'Anna besucht ihre Oma einmal pro Woche. Sie trinken Tee und essen Kuchen zusammen.' },
                {role: "assistant", content: `{
                  "flashcards": [
                  {
                  "id": "1",
                  "front": "besucht",
                  "back": "visits"
                  },
                  {
                  "id": "2",
                  "front": "ihre",
                  "back": "her"
                  },
                  {
                  "id": "3",
                  "front": "Oma",
                  "back": "grandmother"
                  },
                  {
                  "id": "4",
                  "front": "einmal",
                  "back": "once"
                  },
                  {
                  "id": "5",
                  "front": "pro",
                  "back": "per"
                  },
                  {
                  "id": "6",
                  "front": "Woche.",
                  "back": "week."
                  },
                  {
                  "id": "7",
                  "front": "Sie",
                  "back": "They"
                  },
                  {
                  "id": "8",
                  "front": "trinken",
                  "back": "drink"
                  },
                  {
                  "id": "9",
                  "front": "Tee",
                  "back": "tea"
                  },
                  {
                  "id": "10",
                  "front": "und",
                  "back": "and"
                  },
                  {
                  "id": "11",
                  "front": "essen",
                  "back": "eat"
                  },
                  {
                  "id": "12",
                  "front": "Kuchen",
                  "back": "cake"
                  },
                  {
                  "id": "13",
                  "front": "zusammen.",
                  "back": "together."
                  }
                  ]
                  }` },
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
