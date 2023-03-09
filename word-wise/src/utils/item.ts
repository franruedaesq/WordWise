import { LearningContent } from "@/types";

export interface IItem {
    id: string;
    UserId: string;
    Name: string;
    Email: string;
    Level: string;
    TypeOfContent: string;
    Progress: {
      FlashCardsCompleted: number;
      QuizzesCompleted: number;
    };
  }

  export interface IContentItem extends LearningContent{}