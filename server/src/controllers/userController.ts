import { Request, Response } from 'express'
import { sql } from '../config/db'

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await sql.query`
      SELECT UserId, Name, Email, Role, CreatedAt
      FROM Users
      ORDER BY CreatedAt DESC
    `
        res.json(result.recordset)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch users' })
    }
}