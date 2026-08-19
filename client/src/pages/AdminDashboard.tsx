import { useState } from 'react'
import { useGetProductsQuery } from '../api/productsApi'
import {
    useGetAllOrdersAdminQuery,
    useUpdateOrderStatusMutation,
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetAllUsersQuery,
} from '../api/adminApi'
import { useGetCategoriesQuery, useCreateCategoryMutation } from '../api/categoriesApi'
import toast from 'react-hot-toast'

const inputClass = "w-full border border-border/80 rounded-xl px-4 py-3 text-sm text-ink bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all duration-200"

function AdminDashboard() {
    const [tab, setTab] = useState<'products' | 'orders' | 'users'>('products')

    const tabs: { key: typeof tab; label: string }[] = [
        { key: 'products', label: 'Products Inventory' },
        { key: 'orders', label: 'Order Fulfillment' },
        { key: 'users', label: 'Customer Base' },
    ]

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="font-display text-4xl font-bold text-ink mb-10 tracking-tight">Admin Console</h1>

                {/* Pill Tabs */}
                <div className="flex flex-wrap gap-3 mb-10 bg-white p-2 rounded-2xl border border-border/60 shadow-sm w-fit">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === t.key
                                ? 'bg-ink text-white shadow-md'
                                : 'bg-transparent text-stone hover:bg-stone/10 hover:text-ink'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    {tab === 'products' ? <ProductsTab /> : tab === 'orders' ? <OrdersTab /> : <UsersTab />}
                </div>
            </div>
        </div>
    )
}

function ProductsTab() {
    const { data: products, isLoading } = useGetProductsQuery()
    const { data: categories } = useGetCategoriesQuery()
    const [createProduct] = useCreateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()
    const [createCategory] = useCreateCategoryMutation()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [stock, setStock] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [newCategoryName, setNewCategoryName] = useState('')

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createProduct({
                name, description, price: Number(price), imageUrl, stock: Number(stock),
                categoryId: categoryId ? Number(categoryId) : null,
            }).unwrap()
            toast.success('Product created')
            setName(''); setDescription(''); setPrice(''); setImageUrl(''); setStock(''); setCategoryId('')
        } catch {
            toast.error('Failed to create product')
        }
    }

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return
        try {
            await createCategory({ name: newCategoryName }).unwrap()
            toast.success('Category added')
            setNewCategoryName('')
        } catch {
            toast.error('Category already exists or failed to add')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        try {
            await deleteProduct(id).unwrap()
            toast.success('Product deleted')
        } catch {
            toast.error('Failed to delete product')
        }
    }

    return (
        <div>
            {/* Top action bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-6 bg-[#FAFAFA] rounded-2xl border border-border/40">
                <input
                    placeholder="New category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className={`${inputClass} flex-1`}
                />
                <button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-forest text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-forest/90 transition-all shadow-sm whitespace-nowrap"
                >
                    + Add Category
                </button>
            </div>

            <h3 className="text-lg font-bold text-ink mb-6">Add New Product</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                <input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
                <input placeholder="Price (USD)" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} required />
                <input placeholder="Image URL (e.g. http://localhost:5173/img/yourpicturename.jpg)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={`${inputClass} md:col-span-2`} required />
                <input placeholder="Stock Quantity" type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} required />
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
                    <option value="">Select a category (optional)</option>
                    {categories?.map((c) => (
                        <option key={c.CategoryId} value={c.CategoryId}>{c.Name}</option>
                    ))}
                </select>
                <textarea placeholder="Detailed Description" value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} md:col-span-2`} rows={3} required />
                <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="bg-ink text-white px-8 py-3 rounded-xl font-semibold hover:bg-ink/90 transition-all shadow-md">
                        Publish Product
                    </button>
                </div>
            </form>

            <h3 className="text-lg font-bold text-ink mb-6">Current Inventory</h3>
            {isLoading ? (
                <p className="text-stone text-sm">Loading inventory...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products?.map((p) => (
                        <div key={p.ProductId} className="flex flex-col bg-[#FAFAFA] border border-border/60 rounded-2xl p-4 hover:border-border transition-colors">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-white border border-border/40 rounded-xl w-16 h-16 flex items-center justify-center p-1 shrink-0">
                                    <img src={p.ImageUrl} alt={p.Name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-bold text-ink text-sm line-clamp-2 leading-tight mb-1">{p.Name}</p>
                                    <p className="text-xs font-semibold text-gold">${p.Price}</p>
                                </div>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
                                <p className="text-xs text-stone font-medium">
                                    Stock: <span className={p.Stock < 5 ? 'text-danger' : 'text-ink'}>{p.Stock}</span>
                                </p>
                                <button onClick={() => handleDelete(p.ProductId)} className="text-[10px] uppercase tracking-wider font-bold text-danger hover:underline">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function OrdersTab() {
    const { data: orders, isLoading } = useGetAllOrdersAdminQuery()
    const [updateStatus] = useUpdateOrderStatusMutation()

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await updateStatus({ id, status }).unwrap()
            toast.success('Order status updated')
        } catch {
            toast.error('Failed to update status')
        }
    }

    if (isLoading) return <p className="text-stone text-sm">Loading orders...</p>

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border/60 text-[10px] font-bold tracking-widest uppercase text-stone">
                        <th className="pb-4 pr-4">Order ID</th>
                        <th className="pb-4 px-4">Customer</th>
                        <th className="pb-4 px-4">Total</th>
                        <th className="pb-4 pl-4 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                    {orders?.map((order) => (
                        <tr key={order.OrderId} className="hover:bg-[#FAFAFA] transition-colors">
                            <td className="py-4 pr-4 font-medium text-ink">#{order.OrderId}</td>
                            <td className="py-4 px-4">
                                <p className="text-sm font-semibold text-ink">{order.UserName}</p>
                                <p className="text-xs text-stone">{order.UserEmail}</p>
                            </td>
                            <td className="py-4 px-4 font-display font-bold text-gold">${order.TotalAmount.toFixed(2)}</td>
                            <td className="py-4 pl-4 text-right">
                                <select
                                    value={order.Status}
                                    onChange={(e) => handleStatusChange(order.OrderId, e.target.value)}
                                    className="border border-border/80 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 cursor-pointer appearance-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function UsersTab() {
    const { data: users, isLoading } = useGetAllUsersQuery()

    if (isLoading) return <p className="text-stone text-sm">Loading users...</p>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users?.map((u) => (
                <div key={u.UserId} className="flex items-center gap-4 bg-[#FAFAFA] border border-border/60 rounded-2xl p-5 hover:border-border transition-colors">
                    <div className="w-12 h-12 rounded-full bg-stone/10 flex items-center justify-center text-ink font-display font-bold text-lg shrink-0">
                        {u.Name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-bold text-ink text-sm truncate">{u.Name}</p>
                            {u.Role === 'admin' && (
                                <span className="text-[9px] font-bold tracking-widest uppercase bg-gold/10 border border-gold/20 text-gold px-2 py-0.5 rounded-md shrink-0">
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-stone truncate mb-1">{u.Email}</p>
                        <p className="text-[10px] text-stone/60">
                            Joined {new Date(u.CreatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AdminDashboard