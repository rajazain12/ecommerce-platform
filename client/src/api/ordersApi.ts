import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store'

export interface OrderItem {
    OrderItemId: number
    ProductId: number
    Name: string
    ImageUrl: string
    Quantity: number
    PriceAtPurchase: number
}

export interface Order {
    OrderId: number
    TotalAmount: number
    Status: string
    CreatedAt: string
    items: OrderItem[]
}

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        getMyOrders: builder.query<Order[], void>({
            query: () => '/my-orders',
        }),
        getOrderById: builder.query<Order, number>({
            query: (id) => `/${id}`,
        }),
        getAllOrders: builder.query<Order[], void>({
            query: () => '/all',
        }),
        updateOrderStatus: builder.mutation<void, { id: number; status: string }>({
            query: ({ id, status }) => ({
                url: `/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
        }),
    }),
})

export const { useGetMyOrdersQuery, useGetOrderByIdQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation } = ordersApi