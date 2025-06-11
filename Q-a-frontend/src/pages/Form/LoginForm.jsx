import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://api-tdminh-17.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Đăng nhập thất bại!');
        return;
      }

      const token = data.token;
      localStorage.setItem('token', token);

      const profileRes = await fetch('https://api-tdminh-17.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        alert(profileData.message || 'Không lấy được thông tin người dùng!');
        return;
      }

      const user = profileData.data;
      const name = user?.name || '';
      const role = user?.role || '';
      const userId = user?.id;
      const avt = user?.avt || '';

      localStorage.setItem('username', name);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userAvatar', avt);

      toast.success('Đăng nhập thành công!');
      setTimeout(() => navigate('/'), 1500);

      if (role === 'admin') {
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối đến server.');
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`Đang chuyển đến đăng nhập bằng ${provider}...`);

    if (provider === 'google') {
      window.location.href = 'https://api-tdminh-17.onrender.com/auth/google';
    } else if (provider === 'facebook') {
      window.location.href = 'https://api-tdminh-17.onrender.com/auth/facebook';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full bg-white p-6 rounded-2xl shadow-md">
        <div className="relative">
          <h2 className="text-[28px] text-royalblue font-semibold pl-7 relative">
            Đăng nhập
            <span className="absolute left-0 top-1 w-[16px] h-[16px] bg-royalblue rounded-full" />
            <span className="absolute left-0 top-1 w-[16px] h-[16px] bg-royalblue rounded-full animate-ping" />
          </h2>
        </div>

        <LabelInputTop label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <LabelInputTop label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-royalblue hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <button type="submit" className="bg-royalblue hover:bg-blue-700 text-white py-2 rounded-lg text-lg">Đăng nhập</button>

        <p className="text-sm text-center text-gray-600">
          Chưa có tài khoản? <Link to="/register" className="text-royalblue hover:underline">Đăng ký</Link>
        </p>

        <div className="flex items-center gap-4 my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-400 text-sm">hoặc</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-black py-2 rounded-lg text-sm"
          >
            <FcGoogle className="w-5 h-5" />
            Đăng nhập bằng Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            className="flex items-center justify-center gap-2 bg-[#3b5998] hover:bg-[#2d4373] text-white py-2 rounded-lg text-sm"
          >
            <FaFacebookF className="w-5 h-5 text-white" />
            Đăng nhập bằng Facebook
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

const LabelInputTop = ({ label, type, value, onChange }) => {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-gray-700 font-medium">{label}</label>
      <input
        required
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none leading-6 focus:border-royalblue focus:ring-1 focus:ring-royalblue"
      />
    </div>
  );
};

export default LoginForm;