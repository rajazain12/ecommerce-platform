import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../app/store'
import { logout } from '../features/authSlice'

function Navbar() {
    const user = useSelector((state: RootState) => state.auth.user)
    const cartCount = useSelector((state: RootState) =>
        state.cart.items.reduce((sum, item) => sum + item.Quantity, 0)
    )
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        dispatch(logout())
        setMenuOpen(false)
        navigate('/')
    }

    const closeMenu = () => setMenuOpen(false)

    // Premium uppercase styling for nav links
    const linkClass = "text-[11px] font-bold tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors"
    const mobileLinkClass = "block text-xs font-bold tracking-[0.15em] uppercase text-stone hover:text-ink py-3 transition-colors"

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/60 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 lg:py-5">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                    <span className="font-display text-2xl font-bold tracking-tight text-ink group-hover:opacity-80 transition-opacity">
                        ZainStore
                    </span>
                    <span className="w-1.5 h-1.5 bg-forest rounded-full mb-1"></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6 mr-4">
                        <Link to="/" className={linkClass}>Shop</Link>
                        {user && (
                            <>
                                <Link to="/my-orders" className={linkClass}>Orders</Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className={linkClass}>Admin Dashboard</Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-6 pl-6 border-l border-border/60">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-border/60 px-3 py-1.5 rounded-full">
                                    <FaUser className="text-stone text-[10px]" />
                                    <span className="text-[11px] font-semibold text-ink">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-[11px] font-bold tracking-widest uppercase text-stone hover:text-danger transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className={linkClass}>Sign in</Link>
                        )}

                        <Link to="/cart" className="relative flex items-center text-ink hover:text-forest transition-colors p-1">
                            <FaShoppingCart className="text-lg" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-ink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Button & Cart */}
                <div className="flex items-center gap-5 md:hidden">
                    <Link to="/cart" className="relative text-ink hover:text-forest transition-colors p-1">
                        <FaShoppingCart className="text-xl" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-ink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-xl text-ink p-1 hover:text-forest transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col bg-white border-t border-border/40 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-4 space-y-1">
                        <Link to="/" className={mobileLinkClass} onClick={closeMenu}>Shop</Link>
                        {user && (
                            <>
                                <Link to="/my-orders" className={mobileLinkClass} onClick={closeMenu}>Orders</Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className={mobileLinkClass} onClick={closeMenu}>Admin Dashboard</Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="px-6 py-5 bg-[#FAFAFA] border-t border-border/40 flex flex-col gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-border/60 flex items-center justify-center text-ink">
                                        <FaUser className="text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest uppercase text-stone">Signed in as</p>
                                        <p className="text-sm font-semibold text-ink">{user.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-center text-xs font-bold tracking-widest uppercase text-ink border border-border/80 bg-white hover:bg-[#FAFAFA] px-4 py-3 rounded-xl transition-all shadow-sm mt-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="w-full text-center text-xs font-bold tracking-widest uppercase text-white bg-ink hover:bg-ink/90 px-4 py-3 rounded-xl transition-all shadow-sm" onClick={closeMenu}>
                                Sign in to your account
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar