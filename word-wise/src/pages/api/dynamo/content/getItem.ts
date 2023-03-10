import { getLearningContentItemFromDynamoDB } from '@/utils/dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const accessKeyId = process.env.DYNAMODB_ACCESS_KEY || '';
const secretAccessKey = process.env.DYNAMODB_SECRET_KEY || '';
const tableName = 'word-wise-content'; // Change this to your DynamoDB table name

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const id = req.query.id as string; // Read the 'id' parameter from the query string
      const item = await getLearningContentItemFromDynamoDB(accessKeyId, secretAccessKey, tableName, id);
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: `Item with ID ${id} not found` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving content' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
