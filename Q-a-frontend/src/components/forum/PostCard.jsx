import React from "react";
import { useNavigate } from "react-router-dom";
import PostContainer from "./PostContainer";

const PostCard = ({ post, basePath }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`${basePath}/${post.id}`)}
      >
        <PostContainer post={post} showFullContent={false} />
      </div>
    </div>
  );
};

export default PostCard;
