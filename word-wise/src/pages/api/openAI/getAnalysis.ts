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
  response: ChatCompletionResponseMessage | undefined | string;
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
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
            {role: "system", content: `You are DeutschGrammaticGPT, an AI that helps to understand the grammar and syntax of german language. When someone gives you a text, you respond 
            with an explanation of the grammar and syntax of the given text`},
            {role: "user", content: 'Ich möchte bitte einen Cappuccino und ein Stück Apfelkuchen.' },
            {role: "assistant", content: `
                Subject: Ich (I)
                Verb: möchte (would like)
                Adverb: bitte (please)
                Direct object: einen Cappuccino und ein Stück Apfelkuchen (a cappuccino and a piece of apple cake)
                
                The sentence starts with the subject "Ich" (I), followed by the modal verb "möchte" (would like). The adverb "bitte" (please) is added at the end of the sentence to make the request polite. The direct object of the sentence is "einen Cappuccino und ein Stück Apfelkuchen" (a cappuccino and a piece of apple cake), which is in the accusative case as it is the direct recipient of the action.
                
                The word order of the sentence follows the standard pattern for a simple declarative sentence in German, which is subject-verb-object (SVO). However, the direct object is split into two parts, with the article "einen" (a) before "Cappuccino" and "ein" (a) before "Stück Apfelkuchen". This is because German nouns have different articles depending on their gender, number, and case. "Cappuccino" is masculine and singular, so it takes the article "ein" in the accusative case, while "Stück Apfelkuchen" is neuter and singular, so it takes the article "ein" as well.
                ` },
                {role: "user", content: 'Kommt sofort, möchten Sie noch etwas bestellen?' },
                {role: "assistant", content: `
                    Subject: (implied subject)
                    Verb: Kommt (Coming)
                    Adverb: sofort (right away)
                    Direct object: (no direct object)
                    
                    The sentence starts with the verb "Kommt" (Coming), which is in the third person singular and implies the subject "Es" (It). The adverb "sofort" (right away) modifies the verb to indicate that the order will be prepared and served promptly. There is no direct object in this sentence.
                    
                    The second part of the sentence begins with the modal verb "möchten" (would like), which is addressed to the person being served. The pronoun "Sie" (you) is the subject of the sentence, and the infinitive verb "bestellen" (to order) is the action being requested. The word "noch" (still) is used to inquire if the person would like to order anything else in addition to their initial request.` },
                    {role: "user", content: 'Nein, das reicht erstmal.' },
                    {role: "assistant", content: `
                        Subject: (implied subject)
                        Verb: reicht (is enough)
                        Adverb: erstmal (for now)
                        Direct object: das (that)
                        
                        The sentence has an implied subject "Es" (it) which refers to the order or the food and drinks being requested. The verb "reicht" (is enough) is in the third person singular and indicates that the order already placed is sufficient. The adverb "erstmal" (for now) emphasizes that the current order is satisfactory but leaves room for additional orders later. The direct object of the sentence is the pronoun "das" (that), which refers to the order placed by the speaker.
                        
                        The sentence structure follows the pattern of a simple declarative sentence in German, which is subject-verb-object (SVO). However, in this sentence, the subject is implied, and the sentence starts with the negative word "Nein" (No) which indicates the speaker's refusal of the offer to order more items.` },
                        {role: "user", content: text },
        ],
      });
    // Send the generated text as the response
    res.status(200).json({ response: completion.data.choices[0].message, id});
  } catch (err) {
    console.error(err);
    res.status(500);
  }
} catch (err: any) {
  if (err.response && err.response.status === 504) {
    res.status(504).json({ response: "Gateway Timeout", id: req.body.id});
  } else {
    console.error(err);
    res.status(500).json({ response: "Internal Server Error", id: req.body.id});
  }
}
}
