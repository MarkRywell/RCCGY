export type AttendanceRecord = {
  id: string
  member_id: string
  event_id: string
  checked_in_at: string
  created_at?: string | null
  members?: {
    id: string
    name: string
    email?: string | null
    slug?: string | null
  } | null
  events?: {
    id: string
    name: string
    event_date: string
    location?: string | null
  } | null
}
