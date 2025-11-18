import "../assets/LeftSlideBar.css";
import { Link, useLocation } from "react-router-dom";
function LeftSlideBar() {
  const location = useLocation();
  return (
    <div className="left-slide-bar">
      <Link to="/home" className="logo">
        <img src="image.png" alt="Logo" />
      </Link>
      <Link to="/Videos" className="videos">
        Videos
      </Link>
      <Link to="/shorts" className="shorts">
        Shorts
      </Link>
      <Link to="/subscriptions" className="subscriptions">
        Subscriptions
      </Link>
      <Link to="/history" className="history">
        History
      </Link>
      <Link to="/liked-videos" className="liked-videos">
        Liked Videos
      </Link>
    </div>
  );
}
export default LeftSlideBar;
