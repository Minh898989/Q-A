import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GoogleAuthHandler = () => {
    const navigate = useNavigate();
    const hasHandled = useRef(false);

    useEffect(() => {
        if (hasHandled.current) return;
        hasHandled.current = true;

        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        const error = queryParams.get('error');

        if (error) {
            toast.error(error);
            navigate('/login');
            return;
        }

        if (token) {
            localStorage.setItem('token', token);

            fetch('https://api-tdminh-17.onrender.com/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.data) {
                        localStorage.setItem('username', data.data.name);
                        localStorage.setItem('role', data.data.role);

                        toast.success('Đăng nhập bằng Google thành công!', { autoClose: 1000 });
                        if (data.data.role === 'admin') {
                            navigate('/admin');
                        } else {
                            navigate('/');
                        }
                    } else {
                        toast.error('Không lấy được thông tin người dùng.', { autoClose: 1000 });
                        navigate('/login');
                    }
                })
                .catch(() => {
                    toast.error('Lỗi khi xác thực người dùng.', { autoClose: 1000 });
                    navigate('/login');
                });
        } else {
            toast.error('Không có token được trả về!');
            navigate('/login');
        }
    }, [navigate]);

    return <p className="text-center mt-10">Đang xác thực Google, vui lòng đợi...</p>;
};

export default GoogleAuthHandler;
