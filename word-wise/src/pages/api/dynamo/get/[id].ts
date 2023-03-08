import type { NextApiRequest, NextApiResponse } from 'next'
import { getItemFromDynamoDB } from '@/utils/dynamodb'

type Data = {
    error?: string | undefined,
    item?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query

  try {
    const item = await getItemFromDynamoDB(
      process.env.DYNAMODB_ACCESS_KEY || "",
      process.env.DYNAMODB_SECRET_KEY || "",
      id as string
    )
    res.status(200).json({ item })
  } catch (error) {
    res.status(500)
  }
}
