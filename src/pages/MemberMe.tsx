import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Loader from '../components/Loader'
import api from '../lib/supabase'

type State = {
  loading: boolean
  slug: string | null
  error: string | null
}

function MemberMe() {
  const [{ loading, slug, error }, setState] = useState<State>({
    loading: true,
    slug: null,
    error: null,
  })

  useEffect(() => {
    let active = true

    const run = async () => {
      const session = await api.getSession()
      if (!active) return

      const userId = session?.user?.id
      if (!userId) {
        setState({ loading: false, slug: null, error: 'unauthenticated' })
        return
      }

      const member = await api.getMemberByUserId(userId)
      if (!active) return

      if (!member?.slug) {
        setState({ loading: false, slug: null, error: 'missing-member' })
        return
      }

      setState({ loading: false, slug: member.slug, error: null })
    }

    void run()

    return () => {
      active = false
    }
  }, [])

  if (loading) return <Loader />
  if (error) {
    if (error === 'unauthenticated') {
      return <Navigate to="/login" replace />
    }
    return <Navigate to="/404" replace />
  }

  return <Navigate to={`/member/${slug}`} replace />
}

export default MemberMe
