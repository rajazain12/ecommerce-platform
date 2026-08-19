import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
    ProductId: number
    Name: string
    Price: number
    ImageUrl: string
    Quantity: number
    Stock: number
}

interface CartState {
    items: CartItem[]
}

const storedCart = localStorage.getItem('cart')

const initialState: CartState = {
    items: storedCart ? JSON.parse(storedCart) : [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (
            state,
            action: PayloadAction<Omit<CartItem, 'Quantity'>>
        ) => {
            const existing = state.items.find(
                (item) => item.ProductId === action.payload.ProductId
            )
            if (existing) {
                if (existing.Quantity < existing.Stock) {
                    existing.Quantity += 1
                }
            } else {
                state.items.push({ ...action.payload, Quantity: 1 })
            }
            localStorage.setItem('cart', JSON.stringify(state.items))
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                (item) => item.ProductId !== action.payload
            )
            localStorage.setItem('cart', JSON.stringify(state.items))
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            const item = state.items.find(
                (i) => i.ProductId === action.payload.productId
            )
            if (item) {
                const clamped = Math.min(
                    Math.max(1, action.payload.quantity),
                    item.Stock
                )
                item.Quantity = clamped
            }
            localStorage.setItem('cart', JSON.stringify(state.items))
        },
        clearCart: (state) => {
            state.items = []
            localStorage.removeItem('cart')
        },
    },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions
export default cartSlice.reducer