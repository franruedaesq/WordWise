interface Flashcard {
    id: string;
    front: string;
    back: string;
  }
  
  interface Title {
    german: string;
    english: string;
  }
  
  interface LearningContent {
    id: string;
    title: Title;
    text: string;
    type: string;
    size: string;
    difficulty: string;
    flashcards: Flashcard[];
  }
  
export type FakeData = LearningContent[];
  
export interface Generatedtitle {
  german: string;
  english: string;
}

export interface TextObj {
  title: Generatedtitle;
  text: string;
}

export interface LearningText {
  id: string;
  title: Generatedtitle;
  text: string;
  type: string;
  size: string;
  difficulty: string;
}