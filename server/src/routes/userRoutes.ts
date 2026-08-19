import { Router } from 'express'
import { getAllUsers } from '../controllers/userController'
import { protect, requireAdmin } from '../middleware/authMiddleware'

const router = Router()

router.get('/', protect, requireAdmin, getAllUsers)

export default router