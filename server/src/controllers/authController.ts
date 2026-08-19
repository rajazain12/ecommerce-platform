import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sql } from '../config/db'

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const existing = await sql.query`SELECT * FROM Users WHERE Email = ${email}`
        if (existing.recordset.length > 0) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await sql.query`
      INSERT INTO Users (Name, Email, PasswordHash, Role)
      VALUES (${name}, ${email}, ${hashedPassword}, 'customer')
    `

        res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Registration failed' })
    }
}

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
        const result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`
        const user = result.recordset[0]

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.PasswordHash)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { userId: user.UserId, role: user.Role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: {
                id: user.UserId,
                name: user.Name,
                email: user.Email,
                role: user.Role,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Login failed' })
    }
}