import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-6 text-center">
            <div className="font-display text-9xl font-bold text-stone/10 tracking-tighter select-none">
                404
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mt-[-2rem] mb-4 relative z-10">
                Page not found
            </h1>
            <p className="text-stone max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="bg-ink text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-ink/90 transition-all shadow-md hover:-translate-y-0.5"
            >
                Return to Shop
            </Link>
        </div>
    )
}