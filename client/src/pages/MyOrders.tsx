import { useGetMyOrdersQuery } from '../api/ordersApi'
import { Link } from 'react-router-dom'

function statusStyle(status: string) {
    switch (status.toLowerCase()) {
        case 'paid': return 'bg-forest/10 text-forest border-forest/20'
        case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'delivered': return 'bg-ink text-white border-ink'
        case 'cancelled': return 'bg-danger/10 text-danger border-danger/20'
        default: return 'bg-stone/10 text-stone border-stone/20'
    }
}

function MyOrders() {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery()

    if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div></div>
    if (error) return <div className="max-w-3xl mx-auto p-10 text-center text-danger font-medium">Failed to load orders.</div>

    if (!orders || orders.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-32 px-6">
                <div className="w-20 h-20 bg-stone/5 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-8 h-8 text-stone/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h2 className="font-display text-3xl font-bold text-ink mb-3">No orders yet</h2>
                <p className="text-stone mb-8">When you place an order, it'll show up here.</p>
                <Link to="/" className="bg-ink text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-ink/90 transition-all shadow-md">
                    Browse products
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="font-display text-4xl font-bold text-ink mb-10 tracking-tight">Order History</h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <Link
                            key={order.OrderId}
                            to={`/my-orders/${order.OrderId}`}
                            className="group block bg-white border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-200"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-6 border-b border-border/40 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-stone mb-1">Order #{order.OrderId}</p>
                                    <p className="font-medium text-ink">
                                        Placed on {new Date(order.CreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${statusStyle(order.Status)}`}>
                                        {order.Status}
                                    </span>
                                    <p className="font-display text-gold font-bold text-lg">${order.TotalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-3">
                                    {order.items.slice(0, 4).map((item) => (
                                        <div key={item.OrderItemId} className="bg-ivory/50 border border-border/40 rounded-xl w-16 h-16 flex items-center justify-center shrink-0 p-1 mix-blend-multiply">
                                            <img src={item.ImageUrl} alt={item.Name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="bg-[#FAFAFA] border border-border/60 rounded-xl w-16 h-16 flex items-center justify-center font-semibold text-stone shrink-0">
                                            +{order.items.length - 4}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-forest group-hover:underline hidden sm:block">View Details &rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyOrders