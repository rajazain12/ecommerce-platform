import { useParams, Link } from 'react-router-dom'
import { useGetOrderByIdQuery } from '../api/ordersApi'

function statusStyle(status: string) {
    switch (status.toLowerCase()) {
        case 'paid': return 'bg-forest/10 text-forest border-forest/20'
        case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'delivered': return 'bg-ink text-white border-ink'
        case 'cancelled': return 'bg-danger/10 text-danger border-danger/20'
        default: return 'bg-stone/10 text-stone border-stone/20'
    }
}

function OrderDetail() {
    const { id } = useParams<{ id: string }>()
    const { data: order, isLoading, error } = useGetOrderByIdQuery(Number(id))

    if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div></div>
    if (error || !order) return <div className="max-w-2xl mx-auto p-10 text-center text-danger font-medium">Order not found.</div>

    return (
        <div className="bg-[#FAFAFA] min-h-screen">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <Link to="/my-orders" className="inline-flex items-center text-sm font-medium text-stone hover:text-ink transition-colors mb-8">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to orders
                </Link>

                <div className="bg-white border border-border/60 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                    {/* Decorative receipt top edge */}
                    <div className="absolute top-0 left-0 right-0 h-2 flex bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZmlsbD0iI2Y1ZjVmNSIgZD0iTTAgMGwyMCAwaC0yMHoiLz48L3N2Zz4=')] opacity-50"></div>

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10 pb-8 border-b border-dashed border-border">
                        <div>
                            <h1 className="font-display text-3xl font-bold text-ink">Order #{order.OrderId}</h1>
                            <p className="text-sm text-stone mt-2">
                                Placed on {new Date(order.CreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full border shadow-sm ${statusStyle(order.Status)}`}>
                            {order.Status}
                        </span>
                    </div>

                    <div className="space-y-6">
                        {order.items.map((item) => (
                            <div key={item.OrderItemId} className="flex items-center gap-6">
                                <div className="bg-ivory/50 border border-border/40 rounded-2xl w-20 h-20 flex items-center justify-center shrink-0 p-2 mix-blend-multiply">
                                    <img src={item.ImageUrl} alt={item.Name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-ink text-lg">{item.Name}</p>
                                    <p className="text-sm text-stone mt-1">
                                        Qty: {item.Quantity} × ${item.PriceAtPurchase.toFixed(2)}
                                    </p>
                                </div>
                                <p className="font-display text-gold font-bold text-lg">
                                    ${(item.Quantity * item.PriceAtPurchase).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-dashed border-border bg-[#FAFAFA] -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 p-8 sm:p-12">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold tracking-widest uppercase text-stone mb-1">Total Paid</p>
                            </div>
                            <p className="font-display text-4xl font-bold text-ink">
                                ${order.TotalAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail