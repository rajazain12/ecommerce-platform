import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store'

export interface Category {
    CategoryId: number
    Name: string
}

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) headers.set('authorization', `Bearer ${token}`)
            return headers
        },
    }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => '/',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<{ categoryId: number }, { name: string }>({
            query: (body) => ({ url: '/', method: 'POST', body }),
            invalidatesTags: ['Category'],
        }),
    }),
})

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoriesApi