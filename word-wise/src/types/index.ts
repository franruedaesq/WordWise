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
  