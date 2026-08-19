import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { RootState } from '../app/store'
import { removeFromCart, updateQuantity } from '../features/cartSlice'
import toast from 'react-hot-toast'

function Cart() {
    const items = useSelector((state: RootState) => state.cart.items)
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    const total = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0)

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        setIsCheckingOut(true)
        try {
            // FIX: Using environment variable for API URL (fallback to localhost for local dev)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

            const response = await fetch(`${apiUrl}/api/orders/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, userId: user.id }),
            })
            const data = await response.json()
            if (data.url) window.location.href = data.url
        } catch (err) {
            // FIX: Replaced console.error with user-facing toast notification
            toast.error('Checkout failed. Please check your connection and try again.')
        } finally {
            setIsCheckingOut(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-32 px-6">
                <div className="w-20 h-20 bg-stone/5 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-8 h-8 text-stone/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="font-display text-3xl font-bold text-ink mb-3">Your cart is empty</h2>
                <p className="text-stone mb-8">Nothing here yet — let's find something good.</p>
                <Link to="/" className="bg-ink text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-ink/90 transition-all shadow-md">
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="font-display text-4xl font-bold text-ink mb-10 tracking-tight">Your Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Items List */}
                    <div className="flex-1 space-y-6">
                        {items.map((item) => (
                            <div key={item.ProductId} className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white border border-border/60 rounded-2xl p-5 shadow-sm hover:border-border transition-colors">
                                <Link to={`/product/${item.ProductId}`} className="bg-ivory/50 rounded-xl w-24 h-24 flex items-center justify-center shrink-0 p-2 mix-blend-multiply">
                                    <img src={item.ImageUrl} alt={item.Name} className="max-w-full max-h-full object-contain" />
                                </Link>
                                <div className="flex-1">
                                    <Link to={`/product/${item.ProductId}`} className="font-semibold text-ink text-lg hover:text-forest transition-colors line-clamp-1">{item.Name}</Link>
                                    <p className="font-display text-gold font-bold mt-1">${item.Price}</p>
                                </div>
                                <div className="flex items-center gap-6 sm:ml-auto">
                                    <div className="flex items-center border border-border/80 rounded-lg bg-[#FAFAFA]">
                                        <button
                                            onClick={() => dispatch(updateQuantity({ productId: item.ProductId, quantity: Math.max(1, item.Quantity - 1) }))}
                                            className="px-3 py-1.5 text-stone hover:text-ink transition-colors"
                                        >-</button>
                                        <input
                                            type="number"
                                            min={1}
                                            max={item.Stock}
                                            value={item.Quantity}
                                            readOnly
                                            className="w-10 text-center text-sm font-medium bg-transparent border-none focus:ring-0 p-0"
                                        />
                                        <button
                                            onClick={() => {
                                                if (item.Quantity >= item.Stock) toast.error(`Only ${item.Stock} available`)
                                                else dispatch(updateQuantity({ productId: item.ProductId, quantity: item.Quantity + 1 }))
                                            }}
                                            className="px-3 py-1.5 text-stone hover:text-ink transition-colors"
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            dispatch(removeFromCart(item.ProductId))
                                            toast('Item removed', { icon: '🗑️' })
                                        }}
                                        className="text-stone/60 hover:text-danger transition-colors p-2 rounded-full hover:bg-danger/5"
                                        aria-label="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white border border-border/60 rounded-3xl p-6 shadow-sm sticky top-8">
                            <h2 className="text-lg font-bold text-ink mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 text-sm">
                                <div className="flex justify-between text-stone">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-ink">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-stone">
                                    <span>Shipping</span>
                                    <span className="font-medium text-ink">Calculated at checkout</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border/60 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-ink">Total</span>
                                    <span className="font-display text-2xl font-bold text-gold">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full bg-forest text-white py-3.5 rounded-xl font-semibold hover:bg-forest/90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                            >
                                {isCheckingOut ? 'Redirecting...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart