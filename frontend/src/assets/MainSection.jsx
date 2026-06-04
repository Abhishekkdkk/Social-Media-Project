import "./MainSection.css";
import {
  createPost,
  getPosts,
  myProfile,
  toggleLike,
  addComment,
  commentLists,
} from "../services/PostServices.js";

import { useState, useRef, useEffect } from "react";

export default function Main() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    text: "",
    image: null,
  });

  const [commentBox, setCommentBox] = useState({});
  const [comments, setComments] = useState({});
  const [openComments, setOpenComments] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await myProfile();
        setUser(res.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      const postsData = res || [];

      setPosts(postsData);

      const commentsMap = {};

      await Promise.all(
        postsData.map(async (post) => {
          try {
            const res = await commentLists(post._id);
            commentsMap[post._id] = res.comments || [];
          } catch (err) {
            commentsMap[post._id] = [];
          }
        }),
      );

      setComments(commentsMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      setLoading(true);

      const postData = new FormData();
      postData.append("text", formData.text);

      if (formData.image) {
        postData.append("image", formData.image);
      }

      await createPost(postData);

      setFormData({ text: "", image: null });
      setPreviewImage(null);

      await fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likecount: res.likecount } : p,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = async (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (postId) => {
    try {
      const text = commentBox[postId];
      if (!text || text.trim() === "") return;

      await addComment(postId, text);

      setCommentBox((prev) => ({
        ...prev,
        [postId]: "",
      }));

      const res = await commentLists(postId);

      setComments((prev) => ({
        ...prev,
        [postId]: res.comments || [],
      }));
    } catch (err) {
      console.error(err);
    }
  };
  const handleShare = async (postId) => {
    try {
      const url = `${window.location.origin}/post/${postId}`;

      await navigator.clipboard.writeText(url);

      alert("Post link copied!");
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="main-section">
      <div className="post-section">
        <div className="create-post">
          <div className="post-top">
            <div className="user-avatar">
              {user?.avatar?.url && (
                <img
                  src={user.avatar.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            <input
              className="post-input"
              placeholder="What's on your mind?"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
            />
          </div>

          {previewImage && (
            <img
              src={previewImage}
              style={{
                width: "100%",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            />
          )}

          <div className="post-options">
            <div
              className="option"
              onClick={() => fileInputRef.current.click()}
            >
              📷 Photo
            </div>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

            <button
              className="post-btn"
              disabled={loading}
              onClick={handleCreatePost}
            >
              {loading ? "Uploading..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      <div className="feed-section">
        {posts.length === 0 ? (
          <p style={{ color: "#aaa" }}>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div className="post-card" key={post._id}>
              <div className="post-header">
                <img
                  src={post.userId?.avatar?.url}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />

                <div>
                  <div className="post-user">{post.userId?.username}</div>
                  <div className="post-time">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="post-content">{post.text}</div>

              {post.image && (
                <img
                  src={post.image}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                />
              )}

              <div className="post-actions">
                <div onClick={() => handleLike(post._id)}>
                  👍 {post.likecount}
                </div>

                <div onClick={() => toggleComments(post._id)}>
                  💬 {comments[post._id]?.length || 0}
                </div>

                <div onClick={() => handleShare(post._id)}>↗ Share</div>
              </div>

              {openComments[post._id] && (
                <div className="comment-section">
                  <input
                    className="comment-input"
                    placeholder="Write a comment..."
                    value={commentBox[post._id] || ""}
                    onChange={(e) =>
                      setCommentBox({
                        ...commentBox,
                        [post._id]: e.target.value,
                      })
                    }
                  />

                  <button
                    className="comment-btn"
                    onClick={() => handleAddComment(post._id)}
                  >
                    Post
                  </button>

                  {comments[post._id]?.map((c) => (
                    <div key={c._id} className="comment-item">
                      <b className="comment-username">{c.userId?.username}: </b>
                      {c.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
