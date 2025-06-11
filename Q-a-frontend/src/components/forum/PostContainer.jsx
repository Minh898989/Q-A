import React, { useEffect, useState } from "react";
import PostContent from "./PostContent";
import { toast } from "react-toastify";

export default function PostContainer({ post, onEdit, onDelete, showFullContent, commentCount, isOwner, isAdmin}) {
    const [likes, setLikes] = useState(post.likes ?? 0);
    const [dislikes, setDislikes] = useState(post.dislikes ?? 0);
    const [loading, setLoading] = useState(false);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch(`https://api-phu-6.onrender.com/api/likes/stats/${post.id}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                if (!res.ok) throw new Error("Lấy thống kê like/dislike thất bại");
                const data = await res.json();
                if (data.success) {
                    setLikes(data.likes);
                    setDislikes(data.dislikes);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message || "Lỗi lấy thống kê like/dislike", { autoClose: 1000 });
            }
        }

        async function fetchUserVoteStatus() {
            try {
                const res = await fetch(`https://api-phu-6.onrender.com/api/likes/status/${post.id}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setUserVote(data.vote);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchStats();
        fetchUserVoteStatus();
    }, [post.id]);

    const handleLikeDislike = async (is_like) => {
        if (loading) return;

        setLoading(true);

        try {
            const currentVote = userVote;

            if ((is_like && currentVote === 'like') || (!is_like && currentVote === 'dislike')) {
                const res = await fetch("https://api-phu-6.onrender.com/api/likes/", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ post_id: post.id }),
                });
                if (!res.ok) throw new Error("Gỡ vote thất bại");
                toast.info("Đã gỡ vote", { autoClose: 1000 });
                setUserVote(null);
            } else {
                const res = await fetch("https://api-phu-6.onrender.com/api/likes/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ post_id: post.id, is_like }),
                });
                if (!res.ok) throw new Error("Vote thất bại");
                toast.success("Cập nhật vote thành công", { autoClose: 1000 });
                setUserVote(is_like ? "like" : "dislike");
            }

            const statsRes = await fetch(`https://api-phu-6.onrender.com/api/likes/stats/${post.id}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            });
            const statsData = await statsRes.json();
            if (statsData.success) {
                setLikes(statsData.likes);
                setDislikes(statsData.dislikes);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Lỗi xử lý vote", { autoClose: 1000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PostContent
            post={post}
            isOwner={isOwner}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            commentCount={commentCount}
            showFullContent={showFullContent}
            postLikes={likes}
            postDislikes={dislikes}
            onLike={() => {
                if (!loading) handleLikeDislike(true);
            }}
            onDislike={() => {
                if (!loading) handleLikeDislike(false);
            }}
            userVote={userVote}
        />
    );
}
