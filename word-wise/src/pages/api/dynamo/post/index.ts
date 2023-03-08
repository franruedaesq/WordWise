import type { NextApiRequest, NextApiResponse } from 'next';
import { addItemToDynamoDB } from '@/utils/dynamodb';
import { IItem } from '@/utils/item';

type PostRequestBody = {
  accessKeyId: string;
  secretAccessKey: string;
  item: IItem;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }
  
  const { item } = req.body as PostRequestBody;


  try {
    const accessKeyId = process.env.DYNAMODB_ACCESS_KEY || ""
    const secretAccessKey = process.env.DYNAMODB_SECRET_KEY || ""

    await addItemToDynamoDB(accessKeyId, secretAccessKey, item);
    res.status(200).json({ message: 'Item added to DynamoDB' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
