import { lazy, useEffect, useState } from 'react'
import api from '../lib/supabase'
import Loader from './Loader'
import Header from '../layout/Header'
import Nav from '../layout/Nav'
import Footer from '../layout/Footer'

const NotFound = lazy(() => import('../pages/NotFound'))

type AdminGuardProps = {
  children: React.ReactNode
}

type GuardState = 'loading' | 'authorized' | 'forbidden'

function AdminGuard({ children }: AdminGuardProps) {
  const [state, setState] = useState<GuardState>('loading')

  useEffect(() => {
    let active = true

    const checkAuth = async () => {
      const session = await api.getSession()
      if (!active) return
      if (!session?.user) {
        setState('forbidden')
        return
      }

      const member = await api.getMemberByUserId(session.user.id)
      if (!active) return

      if (!member || member.role !== 'admin') {
        setState('forbidden')
        return
      }

      setState('authorized')
    }

    checkAuth()

    return () => {
      active = false
    }
  }, [])

  if (state === 'loading') return <Loader />
  if (state === 'forbidden') {
    return (
      <div className="min-h-dvh w-full overflow-x-hidden">
        <div className="sticky top-0 z-50">
          <Header />
          <Nav />
        </div>
        <NotFound />
        <Footer />
      </div>
    )
  }

  return <>{children}</>
}

export default AdminGuard
