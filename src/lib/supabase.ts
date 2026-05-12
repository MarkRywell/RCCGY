import { createClient } from '@supabase/supabase-js';
import type { Member } from '../types/members';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase env vars missing: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const api = {
    getMemberBySlug: async (slug: string): Promise<Member | null> => {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching member:', error);
            return null;
        }

        return data as Member;
    },
    updateProfilePicture: async (memberId: number, imageUrl: string) => {
        const { data, error } = await supabase
            .from('members')
            .update({ profile_picture_url: imageUrl })
            .eq('id', memberId);

        if (error) {
            console.error('Error updating profile picture:', error);
            return null;
        }

        return data;
    },
    getMembers: async (role?: string): Promise<Member[]> => {
        let query = supabase.from('members').select('*');

        if (role) {
            query = query.eq('role', role);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching members:', error);
            return [];
        }

        return data as Member[];
    }
};

export default api;
