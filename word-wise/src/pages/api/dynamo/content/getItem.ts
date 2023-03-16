import type { NextApiRequest, NextApiResponse } from 'next';

const apiUrl = process.env.API_GET_CONTENT_BY_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const id = req.query.id as string; // Read the 'id' parameter from the query string
      const response = await fetch(`${apiUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Item with ID ${id} not found`);
      }
      const item = await response.json();
      res.status(200).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving content' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
