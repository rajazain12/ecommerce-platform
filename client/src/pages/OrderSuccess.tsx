import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { clearCart } from '../features/cartSlice'

function OrderSuccess() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(clearCart())
    }, [dispatch])

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-6">
            <div className="max-w-md w-full text-center bg-white border border-border/60 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="w-20 h-20 rounded-full bg-forest text-white flex items-center justify-center mx-auto mb-8 shadow-lg shadow-forest/30">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="font-display text-4xl font-bold text-ink mb-4 tracking-tight">Order confirmed</h1>
                <p className="text-stone text-base leading-relaxed mb-10">
                    Thank you for your purchase. Your order has been received and is currently being processed.
                </p>
                <Link
                    to="/"
                    className="block w-full bg-ink text-white px-8 py-4 rounded-xl font-semibold hover:bg-ink/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    Continue Shopping
                </Link>
                <div className="mt-6">
                    <Link to="/my-orders" className="text-sm font-semibold text-stone hover:text-forest transition-colors">
                        View Order History
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess