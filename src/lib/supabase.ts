import { createClient, type Session } from '@supabase/supabase-js'
import type { Member, MemberRole } from '../types/members'
import type { Event } from '../types/events'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export const api = {
  getSession: async (): Promise<Session | null> => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error fetching session:', error)
      return null
    }
    return data.session ?? null
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    return { error }
  },

  getMemberBySlug: async (slug: string): Promise<Member | null> => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching member:', error)
      return null
    }

    return data as Member
  },

  getMemberByUserId: async (userId: string): Promise<Member | null> => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching member by user_id:', error)
      return null
    }

    return data as Member
  },

  updateProfilePicture: async (memberId: number, imageUrl: string) => {
    const { data, error } = await supabase
      .from('members')
      .update({ profile_picture_url: imageUrl })
      .eq('id', memberId)

    if (error) {
      console.error('Error updating profile picture:', error)
      return null
    }

    return data
  },

  getMembers: async (opts: { search?: string; role?: MemberRole } = {}): Promise<Member[]> => {
    const { search, role } = opts
    let query = supabase.from('members').select('*').order('created_at', { ascending: false })

    if (role) {
      query = query.eq('role', role)
    }

    if (search && search.trim()) {
      const like = `%${search.trim()}%`
      query = query.or(`name.ilike.${like},email.ilike.${like},phone.ilike.${like}`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching members:', error)
      return []
    }

    return (data ?? []) as Member[]
  },

  createMember: async (payload: Partial<Member>) => {
    const { data, error } = await supabase
      .from('members')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Error creating member:', error)
    }

    return { data: (data as Member) ?? null, error }
  },

  inviteMember: async (payload: { email: string; name: string; slug?: string }) => {
    const { email, name, slug } = payload

    const data = await supabase.functions.invoke('invite-member', {
      body: { email, name, slug }
    })

    if (data.error) {
      let errorMessage = data.error.message

      try {
        const res = await data.response?.json()

        if (res?.error) {
          if (res.error.includes('Slug')) {
            errorMessage = "Username is already taken. Please choose a different username"
          } else {
            errorMessage = res.error
          }
        }
      } catch {
        // ignore json parse errors
      }

      return {
        data: null,
        error: new Error(errorMessage)
      }
    }

    return { data, error: null }
  },

  updateMember: async (id: string, payload: Partial<Member>) => {
    const { data, error } = await supabase
      .from('members')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating member:', error)
    }

    return { data: (data as Member) ?? null, error }
  },

  deleteMember: async (id: string) => {
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) {
      console.error('Error deleting member:', error)
    }
    return { error }
  },

  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error('Login failed:', error.message)
      return { data: null, error }
    }

    console.log('Login success:', data.session?.user)
    return { data, error: null }
  },

  getEvents: async (opts: { search?: string; startDate?: string; endDate?: string } = {}): Promise<Event[]> => {
    const { search, startDate, endDate } = opts
    let query = supabase.from('events').select('*').order('event_date', { ascending: true })

    if (search && search.trim()) {
      const like = `%${search.trim()}%`
      query = query.or(`name.ilike.${like},location.ilike.${like}`)
    }

    if (startDate) {
      query = query.gte('event_date', startDate)
    }

    if (endDate) {
      query = query.lte('event_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return (data ?? []) as Event[]
  },

  createEvent: async (payload: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
    }

    return { data: (data as Event) ?? null, error }
  },

  updateEvent: async (id: string, payload: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
    }

    return { data: (data as Event) ?? null, error }
  },

  deleteEvent: async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      console.error('Error deleting event:', error)
    }
    return { error }
  }
}

export default api
export { supabase }
