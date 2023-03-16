import type { NextApiRequest, NextApiResponse } from 'next';

const apiUrl = process.env.API_GET_ALL_CONTENT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // const type = req.query.type as string; // Read the 'type' parameter from the query string
      const response = await fetch(`${apiUrl}`);
      if (!response.ok) {
        throw new Error('Error retrieving content');
      }
      const items = await response.json();
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
