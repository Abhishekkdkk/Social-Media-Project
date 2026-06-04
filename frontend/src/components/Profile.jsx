import { useState, useEffect } from "react";
import "./Profile.css";
import { getUserProfile } from "../services/UserProfile.js";
import { myProfile } from "../services/PostServices.js";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [tab, setTab] = useState("posts");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Get logged-in user ID
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const profile = await myProfile();
        setUserId(profile?.user?._id);
      } catch (err) {
        console.error("Failed to fetch my profile:", err);
      }
    };

    fetchMyProfile();
  }, []);

  // 2. Get full profile (only when userId is ready)
  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const { user, posts, friends, followers, following } = userProfile || {};

  if (loading || !userProfile) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* COVER */}
      <div className="cover">
        <div className="cover-overlay"></div>
      </div>

      {/* PROFILE HEADER */}
      <div className="profile-header">
        <img
          src={user?.avatar?.url || user?.avatar || "/default-avatar.png"}
          alt="avatar"
          className="profile-avatar"
        />

        <div className="profile-info">
          <h2>{user?.username}</h2>

          <div className="stats">
            <span>{posts?.length || 0} Posts</span>
            <span>{friends?.length || 0} Friends</span>
            <span>{followers?.length || 0} Followers</span>
            <span>{following?.length || 0} Following</span>
          </div>
        </div>

        <button className="edit-btn">Edit Profile</button>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={tab === "posts" ? "active" : ""}
          onClick={() => setTab("posts")}
        >
          Posts
        </button>

        <button
          className={tab === "friends" ? "active" : ""}
          onClick={() => setTab("friends")}
        >
          Friends
        </button>
      </div>

      {/* CONTENT */}
      <div className="content">
        {/* POSTS */}
        {tab === "posts" && (
          <div className="posts-grid">
            {posts?.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="post-card">
                  <div className="post-header">
                    <img
                      src={
                        post.userId?.avatar?.url ||
                        post.userId?.avatar ||
                        "/default-avatar.png"
                      }
                      alt="user"
                    />
                    <span>{post.userId?.username}</span>
                  </div>

                  <p className="post-text">{post.text}</p>

                  {post.image && (
                    <img src={post.image} className="post-image" alt="post" />
                  )}

                  <div className="post-footer">
                    <span>❤️ {post.likecount}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </div>
        )}

        {/* FRIENDS */}
        {tab === "friends" && (
          <div className="friends-grid">
            {friends?.length > 0 ? (
              friends.map((friend) => (
                <div key={friend._id} className="friend-card">
                  <img
                    src={
                      friend?.avatar?.url ||
                      friend?.avatar ||
                      "/default-avatar.png"
                    }
                    alt="friend"
                  />
                  <p>{friend?.username}</p>
                </div>
              ))
            ) : (
              <p>No friends yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
