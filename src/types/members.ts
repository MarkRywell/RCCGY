export type MemberRole = 'admin' | 'member';

export type Member = {
    id: string; // uuid
    user_id?: string | null;
    slug: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    role: MemberRole;
    profile_picture_url?: string | null;
    profile_picture_public_id?: string | null;
    time_5k?: string | null;
    time_10k?: string | null;
    time_half_marathon?: string | null;
    time_marathon?: string | null;
    created_at?: string | null;
};
