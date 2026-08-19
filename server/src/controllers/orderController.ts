import { Request, Response } from 'express'
import Stripe from 'stripe'
import { sql } from '../config/db'
import { AuthRequest } from '../middleware/authMiddleware'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

interface CartItemInput {
    ProductId: number
    Name: string
    Price: number
    Quantity: number
}

// Admin: get ALL orders (not just the logged-in user's)
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const ordersResult = await sql.query`
      SELECT o.*, u.Name as UserName, u.Email as UserEmail
      FROM Orders o
      JOIN Users u ON o.UserId = u.UserId
      ORDER BY o.CreatedAt DESC
    `
        res.json(ordersResult.recordset)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch orders' })
    }
}

// Admin: update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.body || {}

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid order ID' })
    }

    if (!status) {
        return res.status(400).json({ message: 'Status is required' })
    }

    try {
        await sql.query`UPDATE Orders SET Status = ${status} WHERE OrderId = ${id}`
        res.json({ message: 'Order status updated' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to update order status' })
    }
}

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId

    try {
        const ordersResult = await sql.query`
      SELECT * FROM Orders WHERE UserId = ${userId} ORDER BY CreatedAt DESC
    `
        const orders = ordersResult.recordset

        // For each order, fetch its items
        for (const order of orders) {
            const itemsResult = await sql.query`
        SELECT oi.*, p.Name, p.ImageUrl
        FROM OrderItems oi
        JOIN Products p ON oi.ProductId = p.ProductId
        WHERE oi.OrderId = ${order.OrderId}
      `
            order.items = itemsResult.recordset
        }

        res.json(orders)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch orders' })
    }
}

// Get a single order by ID — only if it belongs to the logged-in user
export const getOrderById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const userId = req.user?.userId

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid order ID' })
    }

    try {
        const orderResult = await sql.query`
      SELECT * FROM Orders WHERE OrderId = ${id} AND UserId = ${userId}
    `
        const order = orderResult.recordset[0]

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        const itemsResult = await sql.query`
      SELECT oi.*, p.Name, p.ImageUrl
      FROM OrderItems oi
      JOIN Products p ON oi.ProductId = p.ProductId
      WHERE oi.OrderId = ${order.OrderId}
    `
        order.items = itemsResult.recordset

        res.json(order)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch order' })
    }
}

export const createCheckoutSession = async (req: Request, res: Response) => {
    const { items, userId } = req.body as { items: CartItemInput[]; userId: number }

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' })
    }

    try {
        const line_items = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: { name: item.Name },
                unit_amount: Math.round(item.Price * 100), // Stripe uses cents
            },
            quantity: item.Quantity,
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cart`,
            metadata: {
                userId: String(userId),
                items: JSON.stringify(items.map((i) => ({ id: i.ProductId, qty: i.Quantity, price: i.Price }))),
            },
        })

        res.json({ url: session.url })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to create checkout session' })
    }
}

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return res.status(400).send('Webhook Error')
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = Number(session.metadata?.userId)
        const items = JSON.parse(session.metadata?.items || '[]') as {
            id: number
            qty: number
            price: number
        }[]

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0)

        try {
            const orderResult = await sql.query`
        INSERT INTO Orders (UserId, TotalAmount, Status)
        OUTPUT INSERTED.OrderId
        VALUES (${userId}, ${totalAmount}, 'paid')
      `
            const orderId = orderResult.recordset[0].OrderId

            for (const item of items) {
                await sql.query`
          INSERT INTO OrderItems (OrderId, ProductId, Quantity, PriceAtPurchase)
          VALUES (${orderId}, ${item.id}, ${item.qty}, ${item.price})
        `

                // Decrement stock now that payment is confirmed
                await sql.query`
          UPDATE Products
          SET Stock = Stock - ${item.qty}
          WHERE ProductId = ${item.id}
        `
            }

            console.log(`✅ Order ${orderId} saved for user ${userId}`)
        } catch (err) {
            console.error('Failed to save order:', err)
        }
    }

    res.json({ received: true })
}