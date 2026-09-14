export type MemberRole = 'admin' | 'member';

export type Member = {
    id: string; // uuid
    user_id?: string | null;
    member_id: number;
    slug: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    birth_date?: string | null;
    emergency_contact?: string | null;
    shoe_size?: number | null;
    shirt_size?: string | null;
    role: MemberRole;
    profile_picture_url?: string | null;
    profile_picture_public_id?: string | null;
    time_5k?: string | null;
    time_10k?: string | null;
    time_half_marathon?: string | null;
    time_marathon?: string | null;
    created_at?: string | null;
};

export type CreateMemberPayload = Omit<Partial<Member>, 'id' | 'member_id' | 'created_at'>;

export type UpdateMemberPayload = Omit<
    Partial<Member>,
    'id' | 'user_id' | 'member_id' | 'created_at'
>;
