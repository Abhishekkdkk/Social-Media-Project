import "./SearchedVideos.css";
import { useLocation } from "react-router";
import VideoCard from "./VideoCard";
function SearchedVideos({ videos }) {
  // console.log("Videos in SearchedVideos component:", videos);
  const location = useLocation();
  const videosFromState = location.state?.videos || [];
  //console.log("Videos from location state:", videosFromState);
  return (
    <div className="searched-videos">
      <div className="left"></div>
      <div className="searched-videos-container">
        {videosFromState.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      <div className="right"></div>
    </div>
  );
}
export default SearchedVideos;
