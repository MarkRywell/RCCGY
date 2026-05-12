import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Loader from "./Loader";

import api from "../lib/supabase";
import type { Member } from "../types/members";

function MemberProfile() {
    const { slug } = useParams<{ slug: string }>();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchMember = async () => {
            if (!slug) {
                setError("Missing member slug");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);

            const data = await api.getMemberBySlug(slug);
            if (!isMounted) return;

            if (!data) {
                setError("Member not found");
                setLoading(false);
                return;
            }

            setMember(data);
            setLoading(false);
        };

        fetchMember();
        return () => {
            isMounted = false;
        };
    }, [slug]);

    const profileImage = useMemo(() => {
        if (member?.profile_picture_url) return member.profile_picture_url;
        return "https://placehold.co/208x208?text=Member"; // 52*4 px placeholder
    }, [member?.profile_picture_url]);

    if (!slug) {
        return <Navigate to="/404" replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-800 text-white">
                <Loader />
            </div>
        );
    }

    if (error || !member) {
        return <Navigate to="/404" replace />;
    }

    const { name, role, phone, email } = member;

    return (
        <>
            <div className="min-h-screen w-full bg-gray-800 text-white text-center flex flex-col">
                <div className="min-h-52 w-full flex flex-col items-center justify-center p-5 gap-5">
                    <img
                        src={profileImage}
                        className="w-52 h-52 object-cover rounded-full"
                        alt={`${name} profile`}
                    />

                    <h1 className="text-3xl font-bold">{name}</h1>
                    <h2 className="text-xl text-secondary font-semibold">{role.toUpperCase()}</h2>
                    <div className="flex flex-col gap-2 w-full px-5 md:w-1/2 lg:w-1/3">
                        <div className="text-lg flex justify-between items-center">
                            <p>Phone</p>
                            <p>{phone || "N/A"}</p>
                        </div>
                        <div className="text-lg flex justify-between items-center">
                            <p>Email</p>
                            <p>{email || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full mx-auto p-6 flex flex-col gap-4">
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Personal Records</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-700 p-4 rounded">
                                <p className="text-sm text-secondary">5K</p>
                                <p className="text-lg font-medium">{member.time_5k || "N/A"}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded">
                                <p className="text-sm text-secondary">10K</p>
                                <p className="text-lg font-medium">{member.time_10k || "N/A"}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded">
                                <p className="text-sm text-secondary">Half Marathon</p>
                                <p className="text-lg font-medium">{member.time_half_marathon || "N/A"}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded">
                                <p className="text-sm text-secondary">Marathon</p>
                                <p className="text-lg font-medium">{member.time_marathon || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MemberProfile;
