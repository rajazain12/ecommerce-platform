import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store'

export interface AdminUser {
    UserId: number
    Name: string
    Email: string
    Role: string
    CreatedAt: string
}

export interface AdminOrder {
    OrderId: number
    UserId: number
    UserName: string
    UserEmail: string
    TotalAmount: number
    Status: string
    CreatedAt: string
}

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    },
})

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Product', 'Order'],
    endpoints: (builder) => ({
        getAllUsers: builder.query<AdminUser[], void>({
            query: () => '/users',
        }),
        getAllOrdersAdmin: builder.query<AdminOrder[], void>({
            query: () => '/orders/all',
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation<{ message: string }, { id: number; status: string }>({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Order'],
        }),
        createProduct: builder.mutation<{ productId: number }, Partial<{
            name: string
            description: string
            price: number
            imageUrl: string
            stock: number
            categoryId: number | null
        }>>({
            query: (body) => ({ url: '/products', method: 'POST', body }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<{ message: string }, { id: number; body: any }>({
            query: ({ id, body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation<{ message: string }, number>({
            query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Product'],
        }),
    }),
})

export const {
    useGetAllOrdersAdminQuery,
    useUpdateOrderStatusMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetAllUsersQuery,
} = adminApi