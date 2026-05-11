function MemberProfile() {
    return (
        <>
            <div className="min-h-screen w-full flex flex-col bg-gray-800">
                <div className="min-h-52 w-full flex items-center justify-center p-10">
                    <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778488362/rccgy/members/yan_qaz7xy.png" className="w-52 h-52 object-cover rounded-full" alt="Member Profile" />
                </div>

                <div className="w-full mx-auto p-6 text-white text-center flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Paul Ryan Reconose</h1>
                    <h2 className="text-xl text-secondary font-semibold">Member</h2>
                    <div className="flex flex-col gap-2">
                        <div className="text-lg flex justify-between items-center">
                            <p>Phone</p>
                            <p>+63 123 456 7890</p>
                        </div>
                        <div className="text-lg flex justify-between items-center">
                            <p>Email</p>
                            <p>yanyan@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MemberProfile;