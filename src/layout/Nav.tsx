import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HiLogin, HiLogout, HiUser } from 'react-icons/hi'
import Logo from '../assets/logos/logo.jpg';
import api, { supabase } from '../lib/supabase'

const NAV_LINKS = [
    { href: '/', label: 'HOME' },
    { href: '/events', label: 'EVENTS' },
    { href: '/partners', label: 'PARTNERS' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' }
]


function Nav() {
    const [isOpen, setIsOpen] = useState(false)
    const [authReady, setAuthReady] = useState(false)
    const [isAuthed, setIsAuthed] = useState(false)
    const [memberSlug, setMemberSlug] = useState<string | null>(null)
    const [memberRole, setMemberRole] = useState<'admin' | 'member' | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const prevBodyOverflow = useRef<string>('')

    // Resolve session and subscribe to auth changes to avoid stale state.
    useEffect(() => {
        let active = true

        const loadSession = async () => {
            const session = await api.getSession()
            if (!active) return
            const userId = session?.user?.id ?? null
            setIsAuthed(!!userId)

            if (userId) {
                const member = await api.getMemberByUserId(userId)
                if (!active) return
                setMemberSlug(member?.slug ?? null)
                setMemberRole(member?.role === 'admin' || member?.role === 'member' ? member.role : null)
            } else {
                setMemberSlug(null)
                setMemberRole(null)
            }

            setAuthReady(true)
        }

        void loadSession()

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!active) return
            const userId = session?.user?.id ?? null
            setIsAuthed(!!userId)

            const refreshMember = async () => {
                if (userId) {
                    const member = await api.getMemberByUserId(userId)
                    if (!active) return
                    setMemberSlug(member?.slug ?? null)
                    setMemberRole(member?.role === 'admin' || member?.role === 'member' ? member.role : null)
                } else {
                    setMemberSlug(null)
                    setMemberRole(null)
                }
                setAuthReady(true)
            }

            void refreshMember()
        })

        return () => {
            active = false
            data?.subscription.unsubscribe()
        }
    }, [])

    const handleLogout = async () => {
        await api.signOut()
        setIsAuthed(false)
        setIsOpen(false)
        navigate('/')
    }

    const profileHref = memberRole === 'admin' ? '/admin' : (memberSlug ? `/member/${memberSlug}` : '/member/me')
    const isProfileRoute = location.pathname.startsWith('/member')
    const isAdminRoute = location.pathname.startsWith('/admin')
    const showLogout = isProfileRoute || isAdminRoute

    // Lock body scroll while open.
    useEffect(() => {
        if (!isOpen) return

        prevBodyOverflow.current = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = prevBodyOverflow.current
        }
    }, [isOpen])

    // Close on Escape.
    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isOpen])

    return (
        <nav className="flex items-center justify-between bg-dark text-white px-4 sm:px-6 lg:px-20 py-4 sm:py-5">
            <Link to="/" className='flex gap-2 items-center flex-2 group cursor-pointer'>
                <img src={Logo} alt="Logo" className='max-w-20 max-h-10'/>
                <h1 className="text-2xl sm:text-3xl font-bold cursor-pointer transition-all duration-200 group-hover:text-primary group-hover:scale-105 origin-left">RCCGY</h1>

            </Link>

            {/* Desktop links */}
            <ul className="hidden sm:flex gap-5 flex-3 font-bold text-lg">
                {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                        <NavLink
                            to={link.href}
                            className={({ isActive }) =>
                                [
                                    'inline-block transition-all duration-200 hover:text-primary hover:scale-105',
                                    isActive ? 'text-primary' : '',
                                ].join(' ')
                            }
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
            
            {/* Desktop auth CTA */}
            {authReady && (
                isAuthed ? (
                    showLogout ? (
                        <button
                            type="button"
                            className="hidden sm:inline-flex items-center gap-2 md:gap-1 lg:gap-2 md:pl-4 font-bold text-lg transition-all duration-200 hover:text-primary hover:scale-105"
                            aria-label="Log out"
                            onClick={handleLogout}
                        >
                            <HiLogout className="text-lg" aria-hidden="true" />
                            <span>LOGOUT</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="hidden sm:inline-flex items-center gap-2 md:gap-1 lg:gap-2 md:pl-4 font-bold text-lg transition-all duration-200 hover:text-primary hover:scale-105"
                            aria-label="Back to profile"
                            onClick={() => navigate(profileHref)}
                        >
                            <HiUser className="text-lg" aria-hidden="true" />
                            <span>BACK TO PROFILE</span>
                        </button>
                    )
                ) : (
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            [
                                'hidden sm:inline-flex items-center gap-2 md:gap-1 lg:gap-2 md:pl-4 font-bold text-lg transition-all duration-200 hover:text-primary hover:scale-105',
                                isActive ? 'text-white' : '',
                            ].join(' ')
                        }
                        aria-label="Go to login"
                    >
                        <HiLogin className="text-lg" aria-hidden="true" />
                        <span>LOGIN</span>
                    </NavLink>
                )
            )}

            {/* Mobile burger */}
            <button
                type="button"
                className="sm:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsOpen((v) => !v)}
            >
                {isOpen ? (
                    // X icon
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                        <path
                            d="M6 6l12 12M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                ) : (
                    // Burger icon
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                        <path
                            d="M4 6h16M4 12h16M4 18h16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                )}
            </button>

            {/* Mobile slide-over drawer */}
            <div id="mobile-menu" className="sm:hidden">
                {/* Backdrop */}
                <div
                    className={
                        `fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 ${
                            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`
                    }
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />

                {/* Panel */}
                <aside
                    className={
                        `fixed right-0 top-0 z-70 h-dvh w-72 bg-dark text-white shadow-xl transition-transform duration-300 ${
                            isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`
                    }
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                >
                    <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                        <span className="font-bold text-lg">Menu</span>
                        
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            aria-label="Close menu"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                                <path
                                    d="M6 6l12 12M18 6L6 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <ul className="flex flex-col gap-1 px-2 py-3 font-bold text-lg">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <NavLink
                                    to={link.href}
                                    className={({ isActive }) =>
                                        [
                                            'block rounded-md px-3 py-3 transition-colors hover:bg-white/10 hover:text-primary',
                                            isActive ? 'text-primary' : '',
                                        ].join(' ')
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                        <li className="px-2 pt-2">
                            {authReady && (
                                isAuthed ? (
                                    showLogout ? (
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-3 transition-colors hover:bg-white/10 hover:text-primary"
                                            aria-label="Log out"
                                            onClick={handleLogout}
                                        >
                                            <HiLogout className="text-lg" aria-hidden="true" />
                                            <span>LOGOUT</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-3 transition-colors hover:bg-white/10 hover:text-primary"
                                            aria-label="Back to profile"
                                            onClick={() => {
                                                setIsOpen(false)
                                                navigate(profileHref)
                                            }}
                                        >
                                            <HiUser className="text-lg" aria-hidden="true" />
                                            <span>BACK TO PROFILE</span>
                                        </button>
                                    )
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            [
                                                'flex items-center justify-start gap-2 rounded-md px-3 py-3 transition-colors hover:bg-white/10 hover:text-primary',
                                                isActive ? 'text-primary' : '',
                                            ].join(' ')
                                        }
                                        aria-label="Go to login"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <HiLogin className="text-lg" aria-hidden="true" />
                                        <span>LOGIN</span>
                                    </NavLink>
                                )
                            )}
                        </li>
                    </ul>
                </aside>
            </div>
        </nav>
    )
}

export default Nav;
