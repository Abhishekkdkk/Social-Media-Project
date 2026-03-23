import "../assets/VideoCard.css";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
export default function VideoCard({ video }) {
  const timeAgo = formatDistanceToNow(new Date(video.uploadDate), {
    addSuffix: true,
  });
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };
  return (
    <div className="main-card" onClick={handleClick}>
      <div className="thumbnail-image">
        <img src={video.thumbnail} alt={video.title} />
      </div>
      <div className="video-user-avatar">
        <img src={video.userId?.avatar?.url} />
        <div className="video-details">
          <p>{video.title}</p>
          <div className="video-info">
            <div>{video.userId?.username}</div>
            <div>
              {video.viewcount} views • {timeAgo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
