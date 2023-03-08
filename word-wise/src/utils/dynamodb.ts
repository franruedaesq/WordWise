import { DynamoDBClient, PutItemCommand, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
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
