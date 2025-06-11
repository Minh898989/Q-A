import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

export default function CommentSection({ postId, onCommentCountChange, onCommentAdded }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const errorToastShown = useRef(false);
    const [replyingTo, setReplyingTo] = useState(null);

    const user = React.useMemo(() => {
        return {
            id: localStorage.getItem('userId'),
            name: localStorage.getItem('username'),
            role: localStorage.getItem('role'),
            avt: localStorage.getItem('userAvatar'),
        };
    }, []);

    const countTotalComments = useCallback((comments) => {
        let count = 0;

        for (const comment of comments) {
            count += 1;
            if (comment.Replies && comment.Replies.length > 0) {
                count += countTotalComments(comment.Replies);
            }
        }

        return count;
    }, []);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`https://api-phu-6.onrender.com/api/comment/${postId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            const data = await res.json();
            setComments(data.comments || []);
            const total = countTotalComments(data.comments || []);
            onCommentCountChange && onCommentCountChange(total);
        } catch (err) {
            if (!errorToastShown.current) {
                toast.error('Lỗi khi tải bình luận', { autoClose: 1000 });
                errorToastShown.current = true;
            }
        }
    }, [postId, onCommentCountChange, countTotalComments]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmitComment = async (content, parentId = null) => {
        if (!content.trim()) return;

        try {
            const res = await fetch(`https://api-phu-6.onrender.com/api/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ post_id: postId, content, parent_id: parentId }),
            });

            const result = await res.json();
            if (res.ok) {
                await fetchComments();
                toast.success('Gửi bình luận thành công!', { autoClose: 1000 });
                onCommentAdded && onCommentAdded();
                setReplyingTo(null);
            } else {
                toast.error(result.message || 'Gửi bình luận thất bại', { autoClose: 1000 });
            }
        } catch (err) {
            toast.error('Lỗi gửi bình luận', { autoClose: 1000 });
        }
    };

    const updateCommentInTree = (comments, id, newContent) => {
        return comments.map(comment => {
            if (comment.id === id) {
                return { ...comment, content: newContent };
            }
            if (comment.Replies && comment.Replies.length > 0) {
                return {
                    ...comment,
                    Replies: updateCommentInTree(comment.Replies, id, newContent),
                };
            }
            return comment;
        });
    };

    const deleteCommentInTree = (comments, idToDelete) => {
        return comments
            .map(comment => {
                if (comment.id === idToDelete) {
                    return null;
                }

                if (comment.Replies && comment.Replies.length > 0) {
                    return {
                        ...comment,
                        Replies: deleteCommentInTree(comment.Replies, idToDelete),
                    };
                }

                return comment;
            })
            .filter(Boolean);
    };

    const handleEditComment = async (id, newContent) => {
        try {
            const res = await fetch(`https://api-phu-6.onrender.com/api/comment/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ content: newContent }),
            });

            if (res.ok) {
                setComments(prev => updateCommentInTree(prev, id, newContent));
                toast.success('Sửa bình luận thành công', { autoClose: 1000 });
            } else {
                const data = await res.json();
                toast.error(data.message || 'Không thể sửa bình luận', { autoClose: 1000 });
            }
        } catch (err) {
            toast.error('Lỗi sửa bình luận', { autoClose: 1000 });
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const res = await fetch(`https://api-phu-6.onrender.com/api/comment/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (res.ok) {
                setComments(prev => {
                    const updatedComments = deleteCommentInTree(prev, id);
                    const total = countTotalComments(updatedComments);
                    onCommentCountChange && onCommentCountChange(total);
                    return updatedComments;
                });
                toast.success('Xóa bình luận thành công', { autoClose: 1000 });
            } else {
                const data = await res.json();
                toast.error(data.message || 'Không thể xóa bình luận', { autoClose: 1000 });
            }
        } catch (err) {
            toast.error('Lỗi xóa bình luận', { autoClose: 1000 });
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-md p-4 border space-y-4 -mt-5">
            <CommentForm
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSubmitComment(newComment);
                    setNewComment('');
                }}
                user={user}
            />

            <hr className="border-gray-300" />

            {comments.length > 0 ? (
                [...comments]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((cmt) => {
                        const isOwner = Number(cmt.User?.id || cmt.user_id) === Number(user.id);
                        return (
                            <CommentItem
                                key={cmt.id}
                                comment={cmt}
                                isOwner={isOwner}
                                onEdit={handleEditComment}
                                onDelete={handleDeleteComment}
                                onReply={(id) => setReplyingTo(id)}
                                replyingTo={replyingTo}
                                onSubmitReply={handleSubmitComment}
                            />
                        );
                    })
            ) : (
                <p className="text-gray-500 italic text-center">Chưa có bình luận nào.</p>
            )}
        </div>
    );
}
