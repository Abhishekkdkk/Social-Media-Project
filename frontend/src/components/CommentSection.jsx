import "./CommentSection.css";
import { useState, useEffect } from "react";
import { commentLists } from "../services/VideoServices.js";
import CommentsList from "./CommentsList.jsx";
import { addComment } from "../services/VideoServices.js";
function CommentSection({ videoId }) {
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const [formData, setFormData] = useState({
    text: "",
    parentText: "",
    repliedToId: null,
  });
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (!videoId) return;
    const fetchComments = async () => {
      try {
        const res = await commentLists(videoId);
        console.log(res);
        setCommentList(res.comments);
        setCommentCount(res.commentCount);
        setCurrentUserAvatar(res.currentUserAvatar);
        //console.log(commentList);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [videoId]);

  const Addcomment = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    try {
      const res = await addComment(videoId, formData);

      // 🔑 NORMALIZE COMMENT SHAPE
      const safeComment = {
        ...res.comment,
        replies: res.comment.replies || [],
        user: res.comment.user || {},
        createdAt: res.comment.createdAt || new Date().toISOString(),
      };

      setCommentList((prev) => [safeComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setFormData((prev) => ({ ...prev, text: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  function handleInput(e) {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, text: value }));
  }

  return (
    <div className="comment-section">
      {commentCount === 1 ? (
        <div className="comment-count">{commentCount} comment</div>
      ) : (
        <div className="comment-count">{commentCount} comments</div>
      )}
      <div className="add-new-comment">
        <div className="avatar">
          <img src={currentUserAvatar} alt="User Avatar"></img>
        </div>
        <div className="text-button">
          <form onSubmit={Addcomment}>
            <input
              onChange={handleInput}
              value={formData.text}
              className="comment-input"
              placeholder="Add a comment..."
            ></input>
            <button type="submit"> Comment</button>
          </form>
        </div>
      </div>
      <div className="comments-list">
        {commentList?.map((comment) => (
          <CommentsList comment={comment} key={comment._id}></CommentsList>
        ))}
      </div>
    </div>
  );
}
export default CommentSection;
