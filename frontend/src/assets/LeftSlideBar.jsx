import "../assets/LeftSlideBar.css";
import { Link, useLocation } from "react-router-dom";

function LeftSlideBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="left-slide-bar">
      <Link to="/home" className="logo">
        <img src="/image.png" alt="Logo" />
      </Link>

      <Link
        to="/Videos"
        className={`nav-item ${isActive("/Videos") ? "active" : ""}`}
      >
        Videos
      </Link>

      <Link
        to="/shorts"
        className={`nav-item ${isActive("/shorts") ? "active" : ""}`}
      >
        Shorts
      </Link>

      <Link
        to="/subscriptions"
        className={`nav-item ${isActive("/subscriptions") ? "active" : ""}`}
      >
        Subscriptions
      </Link>

      <Link
        to="/history"
        className={`nav-item ${isActive("/history") ? "active" : ""}`}
      >
        History
      </Link>

      <Link
        to="/liked-videos"
        className={`nav-item ${isActive("/liked-videos") ? "active" : ""}`}
      >
        Liked Videos
      </Link>
    </div>
  );
}

export default LeftSlideBar;
