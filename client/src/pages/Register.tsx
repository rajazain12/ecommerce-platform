import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRegisterMutation } from '../api/authApi'
import toast from 'react-hot-toast'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [register, { isLoading, error }] = useRegisterMutation()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await register({ name, email, password }).unwrap()
            toast.success('Account created successfully! Please sign in.')
            navigate('/login')
        } catch (err) {
            // FIX: Replaced console.error
            toast.error('Registration failed. This email might already be in use.')
        }
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center bg-[#FAFAFA] px-6 py-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <h1 className="font-display text-4xl font-bold text-ink tracking-tight">Create an account</h1>
                <p className="text-stone mt-3 text-sm">Join to start building your collection.</p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/60 rounded-3xl sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-border/80 rounded-xl px-4 py-3 text-sm text-ink bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-border/80 rounded-xl px-4 py-3 text-sm text-ink bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-border/80 rounded-xl px-4 py-3 text-sm text-ink bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all duration-200"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl">
                                <p className="text-danger text-xs font-medium text-center">Registration failed. Try a different email.</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center bg-ink text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-border/40 pt-6">
                        <p className="text-sm text-stone">
                            Already have an account?{' '}
                            <Link to="/login" className="text-forest font-semibold hover:text-forest/80 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register