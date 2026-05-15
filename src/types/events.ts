export type Event = {
  id: string // uuid
  name: string
  description?: string | null
  location?: string | null
  event_date: string // timestamptz ISO string
  photo_url?: string | null
  created_by?: string | null
  created_at?: string | null
  updated_at?: string | null
}
