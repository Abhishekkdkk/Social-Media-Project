import VideoCard from "./VideoCard";
import "../assets/VideoSection.css";

export default function VideoSection({ videos }) {
  return (
    <div className="video-section">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}
