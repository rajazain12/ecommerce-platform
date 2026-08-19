import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import type { RootState } from '../app/store'
import type { ReactNode } from 'react'

function AdminRoute({ children }: { children: ReactNode }) {
    const user = useSelector((state: RootState) => state.auth.user)

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default AdminRoute