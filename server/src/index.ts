import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import orderRoutes from './routes/orderRoutes'
import userRoutes from './routes/userRoutes'
import categoryRoutes from './routes/categoryRoutes'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())

// Webhook route MUST come before express.json(), since Stripe needs the raw body
app.use('/api/orders', orderRoutes)

app.use('/imgs', express.static(path.join(__dirname, '../imgs')))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running')
})

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)

connectDB()

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})