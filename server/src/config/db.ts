import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config: sql.config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'EcommerceDB',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        trustServerCertificate: true,
        encrypt: false,
    },
}

export const connectDB = async () => {
    try {
        await sql.connect(config)
        console.log('✅ Connected to SQL Server')
    } catch (err) {
        console.error('❌ Database connection failed:', err)
    }
}

export { sql }