import { lazy, useEffect, useState } from 'react'
import api from '../lib/supabase'
import Loader from './Loader'

const NotFound = lazy(() => import('../pages/NotFound'))

type MemberGuardProps = {
  children: React.ReactNode
}

type GuardState = 'loading' | 'authorized' | 'forbidden'

function MemberGuard({ children }: MemberGuardProps) {
  const [state, setState] = useState<GuardState>('loading')

  useEffect(() => {
    let active = true

    const checkAuth = async () => {
      const session = await api.getSession()
      if (!active) return
      const userId = session?.user?.id
      if (!userId) {
        setState('forbidden')
        return
      }

      const member = await api.getMemberByUserId(userId)
      if (!active) return

      if (!member || member.role !== 'member') {
        setState('forbidden')
        return
      }

      setState('authorized')
    }

    void checkAuth()

    return () => {
      active = false
    }
  }, [])

  if (state === 'loading') return <Loader />
  if (state === 'forbidden') return <NotFound />

  return <>{children}</>
}

export default MemberGuard
