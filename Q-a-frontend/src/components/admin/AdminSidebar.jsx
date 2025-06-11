import React from "react";
import { NavLink } from "react-router-dom";
import {
    FileTextOutlined,
    UserOutlined,
    LockOutlined
} from "@ant-design/icons";

export default function AdminSidebar() {
    return (
        <div className="w-64 bg-white shadow-md p-4 space-y-4">
            <NavLink
                to="/admin/posts"
                className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded hover:bg-blue-100 ${isActive ? "bg-blue-200 font-semibold" : ""
                    }`
                }
            >
                <FileTextOutlined />
                <span>Quản lý bài viết</span>
            </NavLink>

            <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded hover:bg-blue-100 ${isActive ? "bg-blue-200 font-semibold" : ""
                    }`
                }
            >
                <UserOutlined />
                <span>Quản lý người dùng</span>
            </NavLink>

            <NavLink
                to="/admin/lock"
                className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded hover:bg-blue-100 ${isActive ? "bg-blue-200 font-semibold" : ""
                    }`
                }
            >
                <LockOutlined />
                <span>Cấp lại mật khẩu</span>
            </NavLink>
        </div>
    );
}
