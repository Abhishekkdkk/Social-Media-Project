import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import { getVideos } from "../services/VideoServices.js";
import "../assets/VideoSection.css";

export default function VideoSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos();
      setVideos(data.videos);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) return <p className="p-5">Loading videos...</p>;

  return (
    <div className="video-section">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}
