import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import MyOrders from '../pages/MyOrders'
import OrderDetail from '../pages/OrderDetail'
import OrderSuccess from '../pages/OrderSuccess'
import AdminDashboard from '../pages/AdminDashboard'
import AdminRoute from '../components/AdminRoute'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-orders/:id" element={<OrderDetail />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes