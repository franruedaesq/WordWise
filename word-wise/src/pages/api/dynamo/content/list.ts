import { getAllItemsFromDynamoDB } from '@/utils/dynamodb';
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
      const type = req.query.type as string; // Read the 'type' parameter from the query string
      const items = await getAllItemsFromDynamoDB(accessKeyId, secretAccessKey, tableName, type);
      console.log(items)
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving content' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
