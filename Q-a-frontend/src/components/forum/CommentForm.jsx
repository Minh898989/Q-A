import { useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

export default function CommentForm({ value, onChange, onSubmit }) {
    const userAvatarRaw = localStorage.getItem('userAvatar');
    const baseUrl = 'https://api-tdminh-17.onrender.com';

    const userAvatar = userAvatarRaw
        ? userAvatarRaw.startsWith('http')
            ? userAvatarRaw
            : baseUrl + userAvatarRaw
        : '/default-avatar.png';

    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        await onSubmit(e);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-start space-x-3 mb-4 ">
            {userAvatar ? (
                <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-9 h-9 rounded-full object-cover mt-1"
                />
            ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300 mt-1" />
            )}

            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={onChange}
                    rows={1}
                    placeholder="Viết bình luận..."
                    className="w-full border border-gray-300 rounded-2xl py-2 px-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm overflow-hidden"
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />
            </div>

            <button
                type="submit"
                className="text-blue-600 mt-2 hover:text-blue-800"
                aria-label="Gửi bình luận"
            >
                <PaperAirplaneIcon className="w-5 h-5" />
            </button>
        </form>
    );
}
