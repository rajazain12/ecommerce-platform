import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface RegisterRequest {
    name: string
    email: string
    password: string
}

interface LoginRequest {
    email: string
    password: string
}

interface AuthResponse {
    token: string
    user: {
        id: number
        name: string
        email: string
        role: string
    }
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth` }),
    endpoints: (builder) => ({
        register: builder.mutation<{ message: string }, RegisterRequest>({
            query: (body) => ({
                url: '/register',
                method: 'POST',
                body,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const { useRegisterMutation, useLoginMutation } = authApi