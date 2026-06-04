import VideoSearchBar from "../assets/VideoSearchBar";
import VideoSection from "../assets/VideoSection";
import LeftSlideBar from "../assets/LeftSlideBar";
import "../components/Videos.css";
import { useState, useEffect } from "react";
import { getVideos } from "../services/VideoServices";

function Videos() {
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

  return (
    <div className="video-page">
      <div className="left-sidebar">
        <LeftSlideBar />
      </div>

      <div className="video-main">
        <VideoSearchBar setVideos={setVideos} />

        <div className="video-feed">
          {loading ? (
            <p className="loading-text">Loading videos...</p>
          ) : (
            <VideoSection videos={videos} />
          )}
        </div>
      </div>

      <div className="right-sidebar">
        <div className="right-box">
          <h4>Recommended</h4>
          <p>Trending</p>
          <p>Latest</p>
        </div>
      </div>
    </div>
  );
}

export default Videos;
