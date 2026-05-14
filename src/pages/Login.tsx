import { useState, type ReactNode } from 'react'
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi'
import Logo from '../assets/logos/logo-bg.png'

type FloatingIconInputProps = {
    type: string
    name: string
    label: string
    icon: ReactNode
    value: string
    onChange: (value: string) => void
}

function FloatingIconInput({ type, name, label, icon, value, onChange }: FloatingIconInputProps) {
    const showOverlay = value.trim() === ''

    return (
        <div className="relative w-full">
            <input
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-transparent focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
                aria-label={label}
            />
            {showOverlay && (
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center gap-2 text-gray-500">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm uppercase tracking-wide">{label}</span>
                </div>
            )}
        </div>
    )
}

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <>
            <div className="min-h-screen w-full flex flex-col items-center justify-center lg:pb-20 bg-gray-800 px-4">
                <div className="flex w-full max-w-sm md:max-w-md flex-col items-center gap-6 bg-dark text-white p-5 sm:p-6 rounded-lg shadow-xl shadow-white/15">
                    <img src={Logo} alt="Logo" className="w-32 mb-2 rounded-full" />
                    <h1 className="text-3xl font-bold">Welcome to Runner</h1>
                    <p className="text-gray-400">Please log in to continue</p>

                    <div className="flex w-full flex-col gap-4">
                        <FloatingIconInput
                            type="email"
                            name="email"
                            label="email address"
                            icon={<HiOutlineMail />}
                            value={email}
                            onChange={setEmail}
                        />

                        <FloatingIconInput
                            type="password"
                            name="password"
                            label="password"
                            icon={<HiOutlineLockClosed />}
                            value={password}
                            onChange={setPassword}
                        />
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-lg bg-secondary px-4 py-3 font-semibold text-white transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </>
    )
}

export default Login
