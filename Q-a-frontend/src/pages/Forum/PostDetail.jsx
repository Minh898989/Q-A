import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import PostContainer from '../../components/forum/PostContainer';
import PostForm from '../../components/forum/PostForm';
import CommentSection from '../../components/forum/CommentSection';

export default function PostDetail() {
    const { id, postId } = useParams();
    const postIdToUse = id || postId;
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const currentUserId = Number(localStorage.getItem('userId'));
    const errorToastShown = useRef(false);
    const [commentCount, setCommentCount] = useState(0);
    const currentUserRole = localStorage.getItem('role');
    const isAdmin = currentUserRole === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postRes = await fetch(`https://api-phu-6.onrender.com/api/post/detail/${postIdToUse}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                const postData = await postRes.json();
                setPost(postData.data);

            } catch (err) {
                console.error('Lỗi khi tải bài viết hoặc bình luận:', err);
                if (!errorToastShown.current) {
                    toast.error('Lỗi khi tải bài viết hoặc bình luận', { autoClose: 1000 });
                    errorToastShown.current = true;
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postIdToUse]);

    useEffect(() => {
        if (post?.comment_count !== undefined) {
            setCommentCount(post.comment_count);
        }
    }, [post]);

    const handleUpdate = async (formData) => {
        try {
            const tags = formData.hashtags ? formData.hashtags.trim().split(/\s+/) : [];

            const res = await fetch(`https://api-phu-6.onrender.com/api/post/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    tags,
                }),
            });

            const result = await res.json();

            if (res.ok) {
                setPost((prev) => ({
                    ...result.data,
                    User: prev.User,
                }));
                setEditing(false);
                toast.success('Cập nhật bài viết thành công!', { autoClose: 1000 });
            } else {
                toast.error('Cập nhật thất bại: ' + (result.message || 'Lỗi không xác định', { autoClose: 1000 }));
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            toast.error('Lỗi khi cập nhật bài viết', { autoClose: 1000 });
        }
    };

    const handleDelete = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                const handleConfirm = async () => {
                    try {
                        const res = await fetch(`https://api-phu-6.onrender.com/api/post/${post.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token'),
                            },
                        });

                        if (res.ok) {
                            toast.success('Xoá thành công', { autoClose: 1000 });
                            navigate('/forum');
                        } else {
                            const result = await res.json();
                            toast.error(result.message || 'Xoá thất bại', { autoClose: 1000 });
                        }
                    } catch (error) {
                        console.error('Xoá thất bại:', error);
                        toast.error('Xoá thất bại', { autoClose: 1000 });
                    }
                    onClose();
                };

                return (
                    <div
                        style={{
                            background: 'white',
                            padding: 20,
                            borderRadius: 8,
                            maxWidth: 400,
                            margin: 'auto',
                            textAlign: 'center',
                        }}
                    >
                        <h2 style={{ marginBottom: 15 }}>Xác nhận</h2>
                        <p style={{ marginBottom: 25 }}>Bạn có chắc chắn muốn xoá bài viết này?</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: 5,
                                    border: 'none',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                Có
                            </button>

                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: 5,
                                    border: '1px solid #aaa',
                                    backgroundColor: 'white',
                                    color: '#333',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                Không
                            </button>
                        </div>
                    </div>
                );
            },
        });
    };

    if (loading) {
        return <div className="text-center text-gray-500 py-8">Đang tải bài viết...</div>;
    }

    if (!post) {
        return <div className="text-center text-red-500 py-8">Không tìm thấy bài viết.</div>;
    }

    const isOwner = currentUserId === Number(post.user_id);

    return (
        <div className="px-4 sm:px-6 py-8 -mt-12 max-w-4xl mx-auto">
            <div className="-ml-32 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-200"
                    style={{ transform: 'translateY(16px)' }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.707 15.707a1 1 0 01-1.414 0L6.586 11H17a1 1 0 100-2H6.586l4.707-4.707a1 1 0 00-1.414-1.414l-6.414 6.414a1 1 0 000 1.414l6.414 6.414a1 1 0 001.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Quay lại</span>
                </button>
            </div>

            <div className="max-w-3xl mx-auto -mt-10">
                <PostContainer
                    post={post}
                    commentCount={commentCount}
                    showFullContent={true}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onEdit={() => setEditing(true)}
                    onDelete={handleDelete}
                />

                {editing && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <PostForm
                            initialData={{
                                title: post.title,
                                content: post.content,
                                hashtags: post.tags?.map((tag) => tag.name).join(' ') || '',
                            }}
                            onClose={() => setEditing(false)}
                            onSubmit={handleUpdate}
                        />
                    </div>
                )}

                <CommentSection postId={post.id} onCommentCountChange={setCommentCount} />
            </div>
        </div>
    );
}
