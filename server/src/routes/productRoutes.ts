import { Router } from 'express'
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController'
import { protect, requireAdmin } from '../middleware/authMiddleware'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', protect, requireAdmin, createProduct)
router.put('/:id', protect, requireAdmin, updateProduct)
router.delete('/:id', protect, requireAdmin, deleteProduct)

export default router