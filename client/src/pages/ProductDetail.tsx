import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useGetProductByIdQuery } from '../api/productsApi'
import { addToCart } from '../features/cartSlice'
import type { RootState } from '../app/store'

function ProductDetail() {
    const { id } = useParams<{ id: string }>()
    const { data: product, isLoading, error } = useGetProductByIdQuery(Number(id))
    const dispatch = useDispatch()

    const cartItem = useSelector((state: RootState) =>
        state.cart.items.find((i) => i.ProductId === Number(id))
    )

    if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div></div>
    if (error || !product) return <div className="max-w-5xl mx-auto p-10 text-center text-danger font-medium">Product not found.</div>

    const handleAddToCart = () => {
        if (cartItem && cartItem.Quantity >= product.Stock) {
            toast.error(`Only ${product.Stock} in stock — that's the max you can add`)
            return
        }
        dispatch(addToCart({
            ProductId: product.ProductId,
            Name: product.Name,
            Price: product.Price,
            ImageUrl: product.ImageUrl,
            Stock: product.Stock,
        }))
        toast.success(`${product.Name} added to cart`)
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-stone hover:text-ink transition-colors mb-8">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Image */}
                    <div className="bg-white border border-border/60 rounded-3xl h-[500px] lg:h-[600px] flex items-center justify-center p-12 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-ivory/20 mix-blend-multiply"></div>
                        <img src={product.ImageUrl} alt={product.Name} className="max-h-full max-w-full object-contain relative z-10 hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Right: Content */}
                    <div className="flex flex-col justify-center">
                        {product.CategoryName && (
                            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone/80 mb-4">
                                {product.CategoryName}
                            </p>
                        )}
                        <h1 className="font-display text-4xl lg:text-5xl font-bold text-ink leading-tight tracking-tight">{product.Name}</h1>
                        <p className="font-display text-gold text-3xl font-semibold mt-6">${product.Price}</p>

                        <div className="w-12 h-px bg-border my-8"></div>

                        <p className="text-stone text-lg leading-relaxed">{product.Description}</p>

                        <div className="mt-8 flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                {product.Stock > 0 ? (
                                    <>
                                        {product.Stock < 10 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-40"></span>}
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-forest"></span>
                                    </>
                                ) : (
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
                                )}
                            </span>
                            <p className="text-sm font-medium">
                                {product.Stock > 0 ? (
                                    <span className="text-ink">
                                        {product.Stock < 10 ? `Only ${product.Stock} units left` : 'In stock and ready to ship'}
                                    </span>
                                ) : (
                                    <span className="text-danger">Currently out of stock</span>
                                )}
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.Stock === 0}
                            className={`mt-10 w-full py-4 rounded-xl font-semibold tracking-wide transition-all duration-300 shadow-md ${product.Stock === 0
                                    ? 'bg-stone/10 text-stone cursor-not-allowed shadow-none'
                                    : 'bg-ink text-white hover:bg-ink/90 hover:shadow-lg hover:-translate-y-0.5'
                                }`}
                        >
                            {product.Stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail