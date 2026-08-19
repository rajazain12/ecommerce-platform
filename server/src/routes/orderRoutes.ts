import { Router } from 'express'
import express from 'express'
import {
    createCheckoutSession,
    handleStripeWebhook,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
} from '../controllers/orderController'
import { protect, requireAdmin } from '../middleware/authMiddleware'

const router = Router()

// Webhook needs the RAW body — must come first, no JSON parsing
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook)

// Everything else can safely use parsed JSON
router.use(express.json())

router.post('/checkout', createCheckoutSession)
router.get('/my-orders', protect, getMyOrders)
router.get('/all', protect, requireAdmin, getAllOrders)
router.put('/:id/status', protect, requireAdmin, updateOrderStatus)
router.get('/:id', protect, getOrderById)

export default router