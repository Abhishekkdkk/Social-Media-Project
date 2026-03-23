import "../components/WatchVideo.css";
import LeftSlideBar from "../assets/LeftSlideBar";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Videoplayer from "./Videoplayer.jsx";
import { getVideoById, viewCount } from "../services/VideoServices.js";

function WatchVideo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [video, setVideo] = useState(null);

  const updatedView = useRef(false);
  const { id } = useParams();
  //console.log(id);
  useEffect(() => {
    const fetchVideo = async () => {
      const res = await getVideoById(id);
      //console.log(res); // res = { video: {...} }
      if (res) setVideo(res.video); // save the inner video object
    };

    if (id) fetchVideo();
  }, [id]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const updateView = async () => {
      if (!updatedView.current) {
        updatedView.current = true;
        await viewCount(id);
      }
    };

    if (id) updateView();
  }, [id]);

  return (
    <div className="main">
      <div className="navBar">
        <div className="three-lines" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {isMenuOpen && <LeftSlideBar />}
      </div>

      <div className="body">
        <div className="video-display-area">
          <Videoplayer url={video} />
        </div>
        <div className="suggestion-videos"></div>
      </div>
    </div>
  );
}

export default WatchVideo;
