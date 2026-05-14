import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

import api from "../lib/supabase";
import { GenerateQRCode, type GenerateQRCodeRef } from "../lib/qrCode";
import type { Member } from "../types/members";

function MemberProfile() {
    const { slug } = useParams<{ slug: string }>();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

    const qrRef = useRef<GenerateQRCodeRef | null>(null);

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

    const memberUrl = slug ? `https://rannncrew.netlify.app/member/${slug}` : "";

    useEffect(() => {
        if (!isQrModalOpen) return;

        const timer = setTimeout(() => {
            const canvas = (qrRef.current as unknown as { canvasRef?: HTMLCanvasElement | null })?.canvasRef;
            if (canvas) {
                setQrDataUrl(canvas.toDataURL("image/png"));
            } else {
                setQrDataUrl(null);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [isQrModalOpen]);

    const handleDownload = () => {
        qrRef.current?.download("png", `${slug || "member"}-qr`);
    };

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
            <div
                className="min-h-screen w-full bg-gray-800 text-white text-center flex flex-col"
                onClick={() => setIsMenuOpen(false)}
            >
                <div className="w-full flex justify-end px-5 pt-4">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                        >
                            <span className="text-2xl leading-none">⋮</span>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-600 bg-gray-700 shadow-lg">
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 text-left hover:bg-gray-600"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsQrModalOpen(true);
                                    }}
                                >
                                    Generate QR Code
                                </button>
                            </div>
                        )}
                    </div>
                </div>

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

            {isQrModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsQrModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Member QR Code"
                >
                    <div
                        className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-white text-center">Member QR Code</h3>
                        <div className="flex justify-center">
                            <GenerateQRCode ref={qrRef} text={memberUrl} />
                        </div>
                        {qrDataUrl && (
                            <div className="mt-4 flex flex-col items-center gap-2">
                                <p className="text-sm text-secondary">Long-press the image below to save on mobile:</p>
                                <img
                                    src={qrDataUrl}
                                    alt="QR code download"
                                    className="h-40 w-40 rounded bg-white p-2"
                                />
                            </div>
                        )}
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-3">
                            <button
                                type="button"
                                className="w-full rounded bg-gray-700 py-2 font-semibold text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary sm:w-auto sm:px-4"
                                onClick={() => {
                                    handleDownload();
                                    setIsQrModalOpen(false);
                                }}
                            >
                                Download QR Code
                            </button>
                            <button
                                type="button"
                                className="w-full rounded bg-secondary py-2 font-semibold text-gray-900 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-secondary sm:w-auto sm:px-4"
                                onClick={() => setIsQrModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MemberProfile;
