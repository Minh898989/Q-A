import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";

export default function PostActions({ likes, dislikes, comments, onLike, onDislike, userVote }) {
  return (
    <div className="flex space-x-6 text-sm mt-4">
      <span
        onClick={(e) => {
          e.stopPropagation();
          onLike?.();
        }}
        className={`flex items-center gap-1 cursor-pointer select-none px-2 py-1 rounded-full transition-all duration-150
    ${userVote === "like"
            ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
            : "text-blue-500 hover:bg-blue-50 hover:text-blue-600"}`}
        title="Thích"
      >
        <AiFillLike size={18} />
        {likes}
      </span>

      <span
        onClick={(e) => {
          e.stopPropagation();
          onDislike?.();
        }}
        className={`flex items-center gap-1 cursor-pointer select-none px-2 py-1 rounded-full transition-all duration-150
    ${userVote === "dislike"
            ? "bg-red-100 text-red-700 font-medium shadow-sm"
            : "text-red-500 hover:bg-red-50 hover:text-red-600"}`}
        title="Không thích"
      >
        <AiFillDislike size={18} />
        {dislikes}
      </span>

      <span
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 text-green-600 cursor-pointer select-none"
        title="Bình luận"
      >
        <BiCommentDetail size={20} />
        {comments}
      </span>
    </div>
  );
}
