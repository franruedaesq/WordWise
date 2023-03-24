import { TextParams, FlashcardParams, TextObj } from "@/types";

export async function fetchText(textType: string, textSize: string, textDifficulty: string) {
    const params: TextParams = {
      textType,
      textSize,
      textDifficulty,
    };
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GET_TEXT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data: TextObj = await resp.json()
    return data
  }
interface FetchResp {
  response: string
}
export async function fetchFlashcards(text: string, id: string) {
    const params: FlashcardParams = {
      text,
      id,
    };
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GET_FLASHCARDS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data = await resp.json()
    return{id: id, content: data.flashcards}
  }

  export async function fetchAnalysis(text: string, id: string) {
    const params = {
      text,
      id,
    };
  
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GET_ANALYSIS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data = await resp.json();
    return { id: id, analysis: data };
  }
  