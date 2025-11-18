import { useNavigate } from "react-router";
import "../assets/VideoSearchBar.css";
export default function VideoSearchBar() {
  const navigate = useNavigate();
  const upload = () => {
    navigate("/upload");
  };
  const search = () => {};
  return (
    <div className="search-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search videos..."
          className="search-input"
        />

        <button className="search-button" onClick={search}>
          🔍
        </button>
      </div>

      <div onClick={upload} className="upload-button">
        Upload
      </div>
    </div>
  );
}
