import { Request, Response } from 'express'
import { sql } from '../config/db'

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await sql.query`SELECT * FROM Categories ORDER BY Name`
        res.json(result.recordset)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch categories' })
    }
}

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' })
    }

    try {
        const result = await sql.query`
      INSERT INTO Categories (Name)
      OUTPUT INSERTED.CategoryId
      VALUES (${name})
    `
        res.status(201).json({ categoryId: result.recordset[0].CategoryId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to create category (may already exist)' })
    }
}