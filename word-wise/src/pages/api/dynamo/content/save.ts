import type { NextApiRequest, NextApiResponse } from 'next';

const apiUrl = process.env.API_ADD_CONTENT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const item = req.body;
      const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Error saving content');
      }
      res.status(200).json({ message: 'Content saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving content' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
