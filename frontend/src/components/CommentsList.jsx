import "./CommentsList.css";
import { useState } from "react";

function CommentsList({ comment }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!comment) return null;

  const { text = "", userId = {} } = comment;

  const avatarUrl = userId?.avatar?.url || "/default-avatar.png";
  const username = userId?.username || "Anonymous";

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setLikes(10);
      setLiked(true);
    } catch (err) {
      console.error("Error toggling like state:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments">
      <div className="avatar">
        <img src={avatarUrl} alt="User Avatar" />
      </div>

      <div className="text-section">
        <div className="username">{username}</div>
        <div className="comment-text">{text}</div>

        <div className={liked ? "likebuttonliked" : "likebutton"}>
          <button onClick={toggleLike}>
            <svg width="18" height="18" fill={liked ? "blue" : "gray"}>
              <path d="M14 1H9L7 8h7l1-7zM5 8H1v12h4V8zm9 0H7l-1 7v5h9l2-9-2-3z" />
            </svg>
            <span>{likes}</span>
          </button>
        </div>

        <div className="replies-button">
          <button>Replies</button>
        </div>
      </div>
    </div>
  );
}

export default CommentsList;
