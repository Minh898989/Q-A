import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GrLogout } from "react-icons/gr";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import ProfileModal from "./ProfileModal";

export default function Header() {
  const [user, setUser] = useState(null);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [detailedUser, setDetailedUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);

  const isHomeActive = location.pathname === "/";
  const isForumActive = location.pathname.startsWith("/forum");
  const isMessageActive = location.pathname.startsWith("/message");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://api-tdminh-17.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data?.data) {
          setUser(data.data);
        } else {
          console.warn("Lỗi khi lấy profile:", data.message);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const fetchNotifications = async (userId) => {
    try {
      const res = await fetch(`https://api-tdminh-17.onrender.com/api/total/${userId}`);
      const data = await res.json();
      setTotalNotifications(data.totalNotifications || 0);
    } catch (err) {
      console.error("Lỗi khi lấy tổng thông báo:", err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = io("https://api-tdminh-17.onrender.com", {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.emit("joinNotificationRoom", user.id);
    socket.on("notificationUpdate", () => {
      fetchNotifications(user.id);
    });

    fetchNotifications(user.id);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
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
      <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md sticky top-0 z-50 font-varela">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-100 rounded-full p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3b82f6"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0v6.5m0 0h5m-5 0H7" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-wide text-blue-700 select-none">UniTalk</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8 font-medium text-blue-600">
            <Link to="/" className={`relative group px-1 py-2 transition-colors duration-300 hover:text-blue-400 ${isHomeActive ? "text-blue-400" : ""}`}>
              Trang chủ
              <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ${isHomeActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>

            <Link to="/forum" className={`relative group px-1 py-2 transition-colors duration-300 hover:text-blue-400 ${isForumActive ? "text-blue-400" : ""}`}>
              Hỏi đáp
              <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ${isForumActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>

            <Link to="/message" className={`relative group px-1 py-2 transition-colors duration-300 hover:text-blue-400 ${isMessageActive ? "text-blue-400" : ""}`}>
              Tin nhắn
              {totalNotifications > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                  {totalNotifications}
                </span>
              )}
              <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ${isMessageActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          </nav>

          {/* Avatar + Logout + Auth */}
          <div className="flex items-center space-x-4">
            {/* Hamburger menu on mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-blue-600 hover:text-blue-400 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {!user ? (
              <div className="hidden md:flex space-x-2">
                <Link to="/login" className="px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold shadow-sm hover:bg-blue-200 transition duration-300">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-300">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <div
                  className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer transition duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={handleOpenProfileModal}
                  title="Xem và sửa hồ sơ"
                >
                  <img
                    src={user.avt || "/default-avatar.png"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-blue-700 font-semibold select-none">
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
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4 text-blue-600 font-medium flex flex-col items-center">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block ${isHomeActive ? "text-blue-400 font-semibold" : ""}`}>
            Trang chủ
          </Link>
          <Link to="/forum" onClick={() => setIsMobileMenuOpen(false)} className={`block ${isForumActive ? "text-blue-400 font-semibold" : ""}`}>
            Hỏi đáp
          </Link>
          <Link to="/message" onClick={() => setIsMobileMenuOpen(false)} className={`block relative ${isMessageActive ? "text-blue-400 font-semibold" : ""}`}>
            Tin nhắn
            {totalNotifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                {totalNotifications}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                Đăng nhập
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <img
                  onClick={handleOpenProfileModal}
                  src={user.avt || "/default-avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-blue-500 cursor-pointer object-cover"
                />
                <span className="text-blue-700 font-semibold">Xin chào, <strong>{user.name}</strong></span>
              </div>
              <button onClick={handleLogout} className="text-red-600 font-semibold">Đăng xuất</button>
            </>
          )}
        </div>
      )}

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
