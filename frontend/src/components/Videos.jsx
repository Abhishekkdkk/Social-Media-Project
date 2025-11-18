import VideoSearchBar from "../assets/VideoSearchBar";
import VideoSection from "../assets/VideoSection";
import LeftSlideBar from "../assets/LeftSlideBar";
import "../components/Videos.css";
function Videos() {
  return (
    <div className="main">
      <div className="left-sidebar">
        <LeftSlideBar />
      </div>
      <div className="video-container">
        <VideoSearchBar />
        <VideoSection />
      </div>
    </div>
  );
}
export default Videos;
