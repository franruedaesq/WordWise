export interface Flashcard {
    id: string;
    front: string;
    back: string;
  }
  
  interface Title {
    german: string;
    english: string;
  }
  
  export interface LearningContent {
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

export interface FlashCardObject {
  id: string;
  flashcards?: Flashcard[] | undefined;
}

export interface LearningText {
  id: string;
  title: Generatedtitle;
  text: string;
  type: string;
  size: string;
  difficulty: string;
}

export interface TextParams {
  textType: string;
  textSize: string;
  textDifficulty: string;
}

export interface FlashcardParams {
  text: string;
  id: string
}

export interface DynamoDBFlashcard {
  M: {
    id: { S: string };
    front: { S: string };
    back: { S: string };
  };
}

export interface DynamoDBTitle {
  S: string;
}

export interface DynamoDBLearningContent {
  id: { S: string };
  title: {
    M: {
      english: DynamoDBTitle;
      german: DynamoDBTitle;
    };
  };
  text: { S: string };
  type: { S: string };
  size: { S: string };
  difficulty: { S: string };
  flashcards: { L: DynamoDBFlashcard[] };
}