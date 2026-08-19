import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Product {
    ProductId: number
    Name: string
    Description: string
    Price: number
    ImageUrl: string
    Stock: number
    CategoryId?: number
    CategoryName?: string
}

export interface ProductFilters {
    search?: string
    categoryId?: number
    minPrice?: number
    maxPrice?: number
}

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], ProductFilters | void>({
            query: (filters) => {
                const params = new URLSearchParams()
                if (filters) {
                    if (filters.search) params.append('search', filters.search)
                    if (filters.categoryId) params.append('categoryId', String(filters.categoryId))
                    if (filters.minPrice) params.append('minPrice', String(filters.minPrice))
                    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice))
                }
                return `/products?${params.toString()}`
            },
            providesTags: ['Product'],
        }),
        getProductById: builder.query<Product, number>({
            query: (id) => `/products/${id}`,
        }),
    }),
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi