import type { NextApiRequest, NextApiResponse } from 'next';
import { addLearningContentToDynamoDB } from '@/utils/dynamodb';
import { IContentItem } from '@/utils/item';

const accessKeyId = process.env.DYNAMODB_ACCESS_KEY || '';
const secretAccessKey = process.env.DYNAMODB_SECRET_KEY || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const item: IContentItem = req.body;
      await addLearningContentToDynamoDB(accessKeyId, secretAccessKey, item);
      res.status(200).json({ message: 'Content saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving content' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}