import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GrLogout } from "react-icons/gr";
import { toast } from "react-toastify";
import ProfileModal from "../layout/ProfileModal";

export default function AdminHeader() {
    const [user, setUser] = useState(null);
    const [detailedUser, setDetailedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("https://api-tdminh-17.onrender.com/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (res.ok && data?.data) {
                    setUser(data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/login");
    };

    const handleOpenProfileModal = async () => {
        if (!user?.id) return;

        try {
            const res = await fetch(`https://api-tdminh-17.onrender.com/api/users/${user.id}`);
            const data = await res.json();

            if (res.ok) {
                const detailed = {
                    ...data.data,
                    isLecturer: data.data.role === "lecturer",
                };

                setDetailedUser(detailed);
                setShowProfileModal(true);
            } else {
                toast.error("Không thể tải thông tin người dùng.", { autoClose: 1000 });
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết user:", error);
            toast.error("Đã xảy ra lỗi.", { autoClose: 1000 });
        }
    };

    return (
        <>
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3b82f6"
                                className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 14l9-5-9-5-9 5 9 5zm0 0v6.5m0 0h5m-5 0H7" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold tracking-wide text-blue-700 select-none">
                            UniTalk Admin
                        </span>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer transition hover:scale-105"
                                onClick={handleOpenProfileModal}
                                title="Xem hồ sơ"
                            >
                                <img
                                    src={user.avt || "/default-avatar.png"}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <span className="text-blue-700 font-semibold">
                                Xin chào, <strong>{user.name}</strong>
                            </span>

                            <GrLogout
                                onClick={handleLogout}
                                style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
                                title="Đăng xuất"
                            />
                        </div>
                    )}
                </div>
            </header>

            {showProfileModal && detailedUser && (
                <ProfileModal
                    detailedUser={detailedUser}
                    setShowProfileModal={setShowProfileModal}
                    setUser={setUser}
                    setDetailedUser={setDetailedUser}
                />
            )}
        </>
    );
}
