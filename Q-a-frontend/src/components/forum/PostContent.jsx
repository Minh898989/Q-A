import React, { useRef, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiFillCheckCircle } from 'react-icons/ai';
import Hashtags from "./Hashtags";
import PostActions from "./PostActions";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function PostContent({
    post,
    showFullContent = true,
    isOwner,
    isAdmin,
    onEdit,
    onDelete,
    commentCount,
    postLikes,
    postDislikes,
    onLike,
    onDislike,
    userVote,
}) {
    const contentRef = useRef(null);
    const [expanded, setExpanded] = useState(showFullContent);
    const [clamped, setClamped] = useState(false);

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diff = (now - postDate) / 1000;

        if (diff < 60) return "Vừa xong";
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    useEffect(() => {
        if (!contentRef.current) return;
        const element = contentRef.current;

        if (showFullContent) {
            setClamped(false);
            return;
        }

        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const maxHeight = 2 * lineHeight;

        if (element.scrollHeight > maxHeight) {
            setClamped(true);
        }
    }, [post.content, showFullContent]);

    const handleOnLike = () => {
        console.log("PostContent: onLike called");
        onLike?.();
    };

    const handleOnDislike = () => {
        console.log("PostContent: onDislike called");
        onDislike?.();
    };

    return (
        <div className="bg-white rounded-3xl shadow-md p-5 border mb-6 relative">
            <div className="absolute top-4 right-4 flex space-x-3">
                {isOwner && (
                    <button
                        onClick={onEdit}
                        title="Sửa bài viết"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <FaEdit size={20} />
                    </button>
                )}
                {(isOwner || isAdmin) && (
                    <button
                        onClick={onDelete}
                        title="Xoá bài viết"
                        className="text-red-600 hover:text-red-800"
                    >
                        <FaTrash size={20} />
                    </button>
                )}
            </div>

            <div className="flex items-center space-x-3 pb-3">
                <img
                    src={post.User?.avt || "/default-avatar.png"}
                    alt={`${post.User?.name || "Ẩn danh"} avatar`}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-300"
                />
                <div className="leading-tight">
                    <p
                        className={`font-semibold transition-colors cursor-pointer mb-0.5 flex items-center ${post.User?.role === 'lecturer' ? 'text-blue-600' : 'text-gray-900'
                            }`}
                    >
                        {post.User?.name}
                        {post.User?.role === 'lecturer' && (
                            <AiFillCheckCircle className="ml-1 text-blue-600" size={16} />
                        )}
                    </p>
                    <p className="text-xs text-gray-500">
                        {getRelativeTime(post.created_at)}
                    </p>
                </div>
            </div>

            <h3 className="font-bold text-lg mb-2 text-gray-800">{post.title}</h3>

            <div className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                <div
                    ref={contentRef}
                    className={
                        !expanded && clamped
                            ? "line-clamp-2 transition-all duration-300"
                            : "transition-all duration-300"
                    }
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
                {!showFullContent && clamped && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="mt-1 text-blue-600 hover:underline focus:outline-none text-xs font-semibold"
                    >
                        Xem thêm
                    </button>
                )}
            </div>

            <Hashtags tags={post.tags?.map((tag) => tag.name)} />

            <PostActions
                likes={postLikes ?? post.likes ?? 0}
                dislikes={postDislikes ?? post.dislikes ?? 0}
                comments={commentCount ?? post.comment_count ?? 0}
                onLike={handleOnLike}
                onDislike={handleOnDislike}
                userVote={userVote}
            />
        </div>
    );
}
