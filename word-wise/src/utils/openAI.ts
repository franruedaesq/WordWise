import { TextParams, FlashcardParams } from "@/types";

export async function fetchText(textType: string, textSize: string, textDifficulty: string) {
    const params: TextParams = {
      textType,
      textSize,
      textDifficulty,
    };

    const resp = await fetch('/api/openAI/getText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await resp.json()
    return data.response.content
  }

export async function fetchFlashcards(text: string, id: string) {
    const params: FlashcardParams = {
      text,
      id,
    };

    const resp = await fetch('/api/openAI/getFlashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data = await resp.json()
    return{id: id, content: data.response.content}
  }