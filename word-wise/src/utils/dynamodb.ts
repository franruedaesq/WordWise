import { DynamoDBLearningContent, LearningContent } from "@/types";
import { DynamoDBClient, PutItemCommand, GetItemCommand, GetItemCommandInput, PutItemCommandInput, ScanCommand } from "@aws-sdk/client-dynamodb";
import { IItem } from "./item";

export const addItemToDynamoDB = async (accessKeyId: string, secretAccessKey: string, item: IItem): Promise<void> => {
  const client = new DynamoDBClient({
    region: "us-east-1", // Cambia esto a la región de tu tabla de DynamoDB
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
  const params = {
    TableName: "word-wise-store",
    Item: {
      "id": { S: item.id },
      "UserId": { S: item.UserId },
      "Name": { S: item.Name },
      "Email": { S: item.Email },
      "Level": { S: item.Level },
      "TypeOfContent": { S: item.TypeOfContent },
      "Progress": {
        M: {
          "FlashCardsCompleted": { N: item.Progress.FlashCardsCompleted.toString() },
          "QuizzesCompleted": { N: item.Progress.QuizzesCompleted.toString() },
        },
      },
    },
  };

  const command = new PutItemCommand(params);
  await client.send(command);
};

export const getItemFromDynamoDB = async (accessKeyId: string, secretAccessKey: string, userId: string): Promise<IItem | undefined> => {
  const client = new DynamoDBClient({
    region: "us-east-1", // Cambia esto a la región de tu tabla de DynamoDB
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  const params: GetItemCommandInput = {
    TableName: "word-wise-store",
    Key: {
      "id": { S: userId },
    },
  };

  const command = new GetItemCommand(params);
  const { Item } = await client.send(command);

  if (!Item) {
    return undefined;
  }

  const { UserId, Name, Email, Level, TypeOfContent, Progress } = Item;

  const progress = {
    FlashCardsCompleted: Progress?.M?.FlashCardsCompleted?.N ? parseInt(Progress.M.FlashCardsCompleted.N) : 0,
    QuizzesCompleted: Progress?.M?.QuizzesCompleted?.N ? parseInt(Progress.M.QuizzesCompleted.N) : 0,
  };

  const item: IItem = {
    id: userId,
    UserId: UserId?.S || "",
    Name: Name?.S || "",
    Email: Email?.S || "",
    Level: Level?.S || "",
    TypeOfContent: TypeOfContent?.S || "",
    Progress: progress,
  };

  return item;
};

export const addLearningContentToDynamoDB = async (
  accessKeyId: string,
  secretAccessKey: string,
  learningContent: LearningContent
): Promise<void> => {
  const client = new DynamoDBClient({
    region: "us-east-1", // Change this to the region of your DynamoDB table
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const params: PutItemCommandInput = {
    TableName: "word-wise-content",
    Item: {
      id: { S: learningContent.id },
      title: {
        M: {
          german: { S: learningContent.title.german },
          english: { S: learningContent.title.english },
        },
      },
      text: { S: learningContent.text },
      type: { S: learningContent.type },
      size: { S: learningContent.size },
      difficulty: { S: learningContent.difficulty },
      flashcards: {
        L: learningContent.flashcards?.map((flashcard) => ({
          M: {
            id: { S: flashcard.id },
            front: { S: flashcard.front },
            back: { S: flashcard.back },
          },
        })) || [],
      },
    },
  };

  const command = new PutItemCommand(params);
  await client.send(command);
};

export async function saveLearningContent(content: LearningContent) {
  const resp = await fetch('/api/dynamo/content/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  });
  const data = await resp.json();
  return data;
}

// export const getAllItemsFromDynamoDB = async (
//   accessKeyId: string,
//   secretAccessKey: string,
//   tableName: string,
//   type?: string
// ): Promise<any[]> => {
//   const client = new DynamoDBClient({
//     region: "us-east-1", // Change this to the region of your DynamoDB table
//     credentials: {
//       accessKeyId,
//       secretAccessKey,
//     },
//   });

//   const params = {
//     TableName: tableName,
//     FilterExpression: type ? "#t = :t" : undefined,
//     ExpressionAttributeNames: type ? { "#t": "type" } : undefined,
//     ExpressionAttributeValues: type ? { ":t": { S: type } } : undefined,
//   };

//   const command = new ScanCommand(params);
//   const response = await client.send(command);

//   return response.Items?.map((item) => {
//     const result: any = {};
//     for (const key in item) {
//       if (Object.prototype.hasOwnProperty.call(item, key)) {
//         result[key] = Object.values(item[key])[0];
//       }
//     }
//     return result;
//   }) || [];
// };

export const getAllItemsFromDynamoDB = async (
  accessKeyId: string,
  secretAccessKey: string,
  tableName: string,
  type?: string
): Promise<LearningContent[]> => {
  const client = new DynamoDBClient({
    region: "us-east-1", // Change this to the region of your DynamoDB table
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const params = {
    TableName: tableName,
    FilterExpression: type ? "#t = :t" : undefined,
    ExpressionAttributeNames: type ? { "#t": "type" } : undefined,
    ExpressionAttributeValues: type ? { ":t": { S: type } } : undefined,
  };

  const command = new ScanCommand(params);
  const response = await client.send(command);

  return formatResponse(response.Items || []);
};

const formatResponse = (response: any[]): LearningContent[] => {
  return response.map((item) => {
    const formattedItem: LearningContent = {
      id: item.id.S,
      title: {
        english: item.title.M.english.S,
        german: item.title.M.german.S,
      },
      text: item.text.S,
      type: item.type.S,
      size: item.size.S,
      difficulty: item.difficulty.S,
      flashcards: item.flashcards?.L.map((flashcard: any) => ({
        id: flashcard.M.id.S,
        front: flashcard.M.front.S,
        back: flashcard.M.back.S,
      })),
    };
    return formattedItem;
  });
};


export async function getLearningContent(type?: string) {
  const resp = await fetch(`/api/dynamo/content/list?type=${type || ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await resp.json();
  return data;
}

const formatItem = (item: DynamoDBLearningContent): LearningContent => {
  const formattedItem: LearningContent = {
    id: item.id.S,
    title: {
      english: item.title.M.english.S,
      german: item.title.M.german.S,
    },
    text: item.text.S,
    type: item.type.S,
    size: item.size.S,
    difficulty: item.difficulty.S,
    flashcards: item.flashcards?.L.map((flashcard) => ({
      id: flashcard.M.id.S,
      front: flashcard.M.front.S,
      back: flashcard.M.back.S,
    })),
  };
  return formattedItem;
};
