import { useState, useEffect } from "react";
import "./Videoplayer.css";
import {
  followUser,
  unfollowUser,
  likeVideo,
} from "../services/FollowUnfollowAndLike.js";
import CommentSection from "./CommentSection.jsx";

import { format, formatDistanceToNow } from "date-fns";

function Videoplayer({ url }) {
  //console.log(url);
  if (!url) url = {};
  if (!url.user) url.user = {};

  const [isFollowed, setIsFollowed] = useState(url.user.isFollowed);
  const [loading, setLoading] = useState(false);
  // console.log("Likes count:", url.likecount);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (url) {
      setLikes(url.likecount || 0);
      setLiked(url.isLiked || false);
    }
  }, [url]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await likeVideo(url._id);
      if (res) {
        setLikes(res.likecount);
        setLiked(res.isLiked);
      }
    } catch (err) {
      console.error("Error toggling like state:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url.user?.isFollowed !== undefined) {
      setIsFollowed(url.user.isFollowed);
    }
  }, [url.user]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFollowed) {
        await unfollowUser(url.user.username);
        setIsFollowed(false);
      } else {
        await followUser(url.user.username);
        setIsFollowed(true);
      }
    } catch (err) {
      console.error("Error toggling follow state:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  function formatNumber(num) {
    if (!num) return "0";
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  }

  const timeago = url?.uploadDate
    ? formatDistanceToNow(new Date(url.uploadDate), {
        addSuffix: true,
      })
    : "unknown time";

  return (
    <>
      <video className="video" src={url?.videourl} controls></video>

      <div className="video-details">
        <div className="title">{url?.title}</div>
        <div className="video-user-avatar-details">
          <div className="left-section">
            <div className="video-user-avatar">
              <img src={url.user?.avatar?.url} alt="User avatar" />
            </div>

            <div className="channel-details">
              <div className="channel-name">{url.user?.username}</div>
              <div className="follower-count">
                {formatNumber(url.user?.followerCount)} followers
              </div>
            </div>

            <div className={isFollowed ? "followedbutton" : "tofollowbutton"}>
              <button onClick={handleToggle}>
                {loading ? "..." : isFollowed ? "Followed" : "Follow"}
              </button>
            </div>
          </div>
          <div className="right-section">
            <div className={liked ? "likebuttonliked" : "likebutton"}>
              <button onClick={toggleLike}>
                {liked ? (
                  <svg width="24" height="24" fill="blue">
                    <path d="M14 1H9L7 8h7l1-7zM5 8H1v12h4V8zm9 0H7l-1 7v5h9l2-9-2-3z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="gray">
                    <path d="M14 1H9L7 8h7l1-7zM5 8H1v12h4V8zm9 0H7l-1 7v5h9l2-9-2-3z" />
                  </svg>
                )}
                <span>{likes}</span>
              </button>
            </div>
            <div className="sharebutton">
              <button onClick={handleShare}>
                <svg width="20" height="20" fill="black">
                  <path d="M14 8l-4-4v3H6v2h4v3l4-4zM5 16h10v2H5z" />
                </svg>
                <span style={{ fontSize: "14px" }}>Share</span>
              </button>
            </div>
          </div>
        </div>
        <div className="description-section">
          <div className="views-and-date">
            <div>{formatNumber(url?.viewcount)} views</div>
            <div>{timeago}</div>
          </div>
          <p className={`description-text ${expanded ? "expanded" : ""}`}>
            {url?.description || "No description available."}
          </p>
          {url?.description && url.description.length > 200 && (
            <button className="read-more" onClick={toggleDescription}>
              <b>{expanded ? "Show Less" : "Read More"}</b>
            </button>
          )}
        </div>

        <div className="comment-section-container">
          <CommentSection videoId={url?._id} />
        </div>
      </div>
    </>
  );
}

export default Videoplayer;
