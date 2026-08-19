import { configureStore } from '@reduxjs/toolkit'
import { productsApi } from '../api/productsApi'
import { authApi } from '../api/authApi'
import { ordersApi } from '../api/ordersApi'
import authReducer from '../features/authSlice'
import cartReducer from '../features/cartSlice'
import { adminApi } from '../api/adminApi'
import { categoriesApi } from '../api/categoriesApi'

export const store = configureStore({
    reducer: {
        [adminApi.reducerPath]: adminApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        auth: authReducer,
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            adminApi.middleware,
            productsApi.middleware,
            authApi.middleware,
            ordersApi.middleware,
            categoriesApi.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch