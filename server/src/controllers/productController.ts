import { Request, Response } from 'express'
import { sql } from '../config/db'

// CREATE
export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, imageUrl, stock, categoryId } = req.body || {}

    if (!name || price === undefined) {
        return res.status(400).json({ message: 'Product name and price are required' })
    }

    try {
        const result = await sql.query`
      INSERT INTO Products (Name, Description, Price, ImageUrl, Stock, CategoryId)
      OUTPUT INSERTED.ProductId
      VALUES (${name}, ${description || ''}, ${price}, ${imageUrl || ''}, ${stock || 0}, ${categoryId || null})
    `
        res.status(201).json({ productId: result.recordset[0].ProductId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to create product' })
    }
}

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, description, price, imageUrl, stock, categoryId } = req.body || {}

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid product ID' })
    }

    try {
        await sql.query`
      UPDATE Products
      SET Name = ${name}, Description = ${description}, Price = ${price},
          ImageUrl = ${imageUrl}, Stock = ${stock}, CategoryId = ${categoryId || null}
      WHERE ProductId = ${id}
    `
        res.json({ message: 'Product updated' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to update product' })
    }
}

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid product ID' })
    }

    try {
        await sql.query`DELETE FROM Products WHERE ProductId = ${id}`
        res.json({ message: 'Product deleted' })
    } catch (err: any) {
        if (err?.number === 547 || err?.originalError?.info?.number === 547 || err?.message?.includes('REFERENCE constraint')) {
            console.warn(`[Product ${id}] Cannot delete: product has associated orders.`)
            return res.status(400).json({ message: 'Cannot delete product because it has associated orders.' })
        }
        console.error('Error deleting product:', err)
        res.status(500).json({ message: 'Failed to delete product' })
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    const { search, categoryId, minPrice, maxPrice } = req.query

    try {
        let query = `
      SELECT p.*, c.Name as CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
      WHERE 1=1
    `
        const request = new sql.Request()

        if (search) {
            query += ` AND p.Name LIKE @search`
            request.input('search', sql.NVarChar, `%${search}%`)
        }

        if (categoryId && !isNaN(Number(categoryId))) {
            query += ` AND p.CategoryId = @categoryId`
            request.input('categoryId', sql.Int, Number(categoryId))
        }

        if (minPrice && !isNaN(Number(minPrice))) {
            query += ` AND p.Price >= @minPrice`
            request.input('minPrice', sql.Decimal(10, 2), Number(minPrice))
        }

        if (maxPrice && !isNaN(Number(maxPrice))) {
            query += ` AND p.Price <= @maxPrice`
            request.input('maxPrice', sql.Decimal(10, 2), Number(maxPrice))
        }

        query += ` ORDER BY p.CreatedAt DESC`

        const result = await request.query(query)
        res.json(result.recordset)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch products' })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid product ID' })
    }

    try {
        const result = await sql.query`
      SELECT p.*, c.Name as CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = ${id}
    `
        const product = result.recordset[0]

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json(product)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch product' })
    }
}