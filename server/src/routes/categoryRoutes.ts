import { Router } from 'express'
import { getAllCategories, createCategory } from '../controllers/categoryController'
import { protect, requireAdmin } from '../middleware/authMiddleware'

const router = Router()

router.get('/', getAllCategories)
router.post('/', protect, requireAdmin, createCategory)

export default router