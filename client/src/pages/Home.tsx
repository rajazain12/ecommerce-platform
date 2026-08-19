import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../api/productsApi'
import { useGetCategoriesQuery } from '../api/categoriesApi'

// --- Custom Reveal Component ---
// Uses IntersectionObserver to trigger a buttery-smooth fade and slide up
const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (ref.current) observer.unobserve(ref.current)
                }
            },
            {
                rootMargin: '0px 0px -50px 0px', // Triggers slightly before the element is fully in view
                threshold: 0.1
            }
        )

        if (ref.current) observer.observe(ref.current)

        return () => {
            if (ref.current) observer.unobserve(ref.current)
        }
    }, [])

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}

// Extracted Component: Product Card
const ProductCard = ({ product }) => (
    <Link
        to={`/product/${product.ProductId}`}
        className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 ease-out border border-transparent hover:border-border/60"
    >
        <div className="relative w-full aspect-[4/5] flex items-center justify-center overflow-hidden p-6 bg-gradient-to-br from-stone/5 to-stone/10">
            <img
                src={product.ImageUrl}
                alt={product.Name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-multiply"
            />

            {product.Stock === 0 && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-ink text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm">
                    Sold Out
                </div>
            )}

            <div className="absolute bottom-5 left-5 right-5 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                <span className="w-full text-center bg-white/90 backdrop-blur-md text-ink text-xs font-bold uppercase tracking-widest py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    Quick Look
                </span>
            </div>
        </div>

        <div className="p-6 flex flex-col flex-grow bg-white">
            <div className="mb-auto">
                <div className="flex justify-between items-start mb-2.5">
                    {product.CategoryName && (
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone/60">
                            {product.CategoryName}
                        </span>
                    )}
                </div>
                <h2 className="font-semibold text-ink text-lg leading-snug mb-3 line-clamp-2 group-hover:text-forest transition-colors duration-300">
                    {product.Name}
                </h2>
            </div>
            <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                <p className="font-display text-ink text-xl font-medium tracking-tight">
                    ${product.Price}
                </p>
                <div className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center group-hover:bg-forest group-hover:border-forest group-hover:text-white text-stone transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </div>
        </div>
    </Link>
)

// Extracted Component: Loading Skeleton
const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden flex flex-col">
                <div className="bg-stone/5 aspect-[4/5] w-full" />
                <div className="p-6 space-y-4 flex flex-col flex-grow">
                    <div className="h-2.5 bg-stone/10 rounded-full w-1/4" />
                    <div className="space-y-3">
                        <div className="h-5 bg-stone/10 rounded-full w-5/6" />
                        <div className="h-5 bg-stone/10 rounded-full w-1/2" />
                    </div>
                    <div className="mt-auto pt-4 border-t border-border/30">
                        <div className="h-6 bg-stone/10 rounded-full w-1/4" />
                    </div>
                </div>
            </div>
        ))}
    </div>
)

export default function Home() {
    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        minPrice: '',
        maxPrice: ''
    })

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const clearFilters = () => {
        setFilters({ search: '', categoryId: '', minPrice: '', maxPrice: '' })
    }

    const hasActiveFilters = Object.values(filters).some(val => val !== '')

    const { data: categories } = useGetCategoriesQuery()
    const { data: products, isLoading, error } = useGetProductsQuery({
        search: filters.search || undefined,
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    })

    return (
        <div className="min-h-screen bg-[#FAFAFA] selection:bg-forest/20 selection:text-ink">
            {/* Hero Section - Staggered Reveals */}
            <div className="relative bg-white border-b border-border/40 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone/10 via-white to-white pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
                    <Reveal delay={0}>
                        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-border shadow-sm text-ink text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse"></span>
                            Curated Collection
                        </span>
                    </Reveal>

                    <Reveal delay={150}>
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink max-w-4xl leading-[1.05] tracking-tight mb-6">
                            Everyday objects, <br className="hidden md:block" />
                            <span className="text-stone/60">elevated.</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={300}>
                        <p className="text-stone/80 mt-2 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                            Discover our latest arrivals. Thoughtfully designed, honestly priced, and built to stand the test of time.
                        </p>
                    </Reveal>

                    <Reveal delay={450}>
                        <button
                            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                            className="bg-ink text-white px-8 py-4 rounded-2xl text-sm font-bold tracking-wide hover:bg-ink/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Explore the Shop
                        </button>
                    </Reveal>
                </div>
            </div>

            <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 xl:gap-20 px-6 py-16 lg:py-24">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 shrink-0">
                    <Reveal delay={100} className="space-y-10 lg:sticky lg:top-24">

                        {/* Search Filter */}
                        <div>
                            <label htmlFor="search" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-stone mb-4">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                Search
                            </label>
                            <input
                                id="search"
                                name="search"
                                type="text"
                                placeholder="What are you looking for?"
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-ink placeholder:text-stone/40 focus:outline-none focus:ring-4 focus:ring-forest/10 focus:border-forest transition-all duration-300 shadow-sm"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label htmlFor="category" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-stone mb-4">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    name="categoryId"
                                    value={filters.categoryId}
                                    onChange={handleFilterChange}
                                    className="w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-ink focus:outline-none focus:ring-4 focus:ring-forest/10 focus:border-forest transition-all duration-300 cursor-pointer appearance-none shadow-sm"
                                >
                                    <option value="">All Collections</option>
                                    {categories?.map((c) => (
                                        <option key={c.CategoryId} value={c.CategoryId}>{c.Name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Unified Price Filter */}
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-stone mb-4">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Price Range
                            </label>
                            <div className="flex items-center bg-white border border-border/80 rounded-2xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-forest/10 focus-within:border-forest transition-all duration-300">
                                <div className="relative w-full flex items-center">
                                    <span className="absolute left-4 text-stone/40 text-sm font-medium">$</span>
                                    <input
                                        name="minPrice"
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        className="w-full bg-transparent pl-8 pr-4 py-4 text-sm text-ink focus:outline-none"
                                    />
                                </div>
                                <div className="w-px h-8 bg-border/80 shrink-0"></div>
                                <div className="relative w-full flex items-center">
                                    <span className="absolute left-4 text-stone/40 text-sm font-medium">$</span>
                                    <input
                                        name="maxPrice"
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        className="w-full bg-transparent pl-8 pr-4 py-4 text-sm text-ink focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-4 px-5 rounded-2xl text-[11px] font-bold tracking-widest uppercase text-danger bg-danger/5 hover:bg-danger/10 transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                Reset Filters
                            </button>
                        )}
                    </Reveal>
                </aside>

                {/* Product Grid Layout */}
                <div className="flex-1">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <Reveal>
                            <div className="p-12 bg-white border border-danger/20 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
                                <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-ink mb-2">Unable to load products</h3>
                                <p className="text-stone">Please check your connection and try refreshing the page.</p>
                            </div>
                        </Reveal>
                    ) : products?.length === 0 ? (
                        <Reveal>
                            <div className="flex flex-col items-center justify-center py-32 px-6 bg-white border border-border/40 rounded-3xl shadow-sm text-center">
                                <div className="w-20 h-20 bg-[#FAFAFA] border border-border/60 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                                    <svg className="w-8 h-8 text-stone/40 -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-ink mb-3 tracking-tight">Nothing found</h3>
                                <p className="text-stone max-w-md mb-10 text-lg">
                                    We couldn't find any items matching your exact criteria. Try adjusting your search or clearing your filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-ink text-white px-10 py-4 rounded-2xl text-sm font-bold tracking-wide hover:bg-ink/90 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </Reveal>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                            {products?.map((product, index) => (
                                /* Stagger the product reveals based on their index (loops every 6) */
                                <Reveal key={product.ProductId} delay={(index % 6) * 100}>
                                    <ProductCard product={product} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}