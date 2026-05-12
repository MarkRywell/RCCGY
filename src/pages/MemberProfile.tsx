import { Navigate, useParams } from "react-router-dom";

import { members } from "../assets/data/members";
import type { Member } from "../types/members";

function MemberProfile() {
    const { id } = useParams<{ id: string }>();

    // Guard against missing/invalid ids early
    const memberId = Number(id);
    if (!id || Number.isNaN(memberId)) {
        return <Navigate to="/404" replace />;
    }

    const member: Member | undefined = members.find((m) => m.id === memberId);

    // Redirect to global NotFound when member is missing
    if (!member) {
        return <Navigate to="/404" replace />;
    }

    const { name, role, phone, email, profilePicture } = member;

    return (
        <>
            <div className="min-h-screen w-full flex flex-col bg-gray-800">
                <div className="min-h-52 w-full flex items-center justify-center p-10">
                    <img
                        src={profilePicture}
                        className="w-52 h-52 object-cover rounded-full"
                        alt={`${name} profile`}
                    />
                </div>

                <div className="w-full mx-auto p-6 text-white text-center flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{name}</h1>
                    <h2 className="text-xl text-secondary font-semibold">{role}</h2>
                    <div className="flex flex-col gap-2">
                        <div className="text-lg flex justify-between items-center">
                            <p>Phone</p>
                            <p>{phone}</p>
                        </div>
                        <div className="text-lg flex justify-between items-center">
                            <p>Email</p>
                            <p>{email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MemberProfile;
