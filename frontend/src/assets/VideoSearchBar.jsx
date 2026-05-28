import { useNavigate } from "react-router";
import "../assets/VideoSearchBar.css";
import { queryVideo } from "../services/VideoServices";
export default function VideoSearchBar() {
  const navigate = useNavigate();
  const upload = () => {
    navigate("/upload");
  };
  const search = async () => {
    const query = document.querySelector(".search-input").value.trim();
    //console.log("Search query:", query);
    if (query) {
      const response = await queryVideo(query);
      //console.log("Search results:", response);

      navigate(`/Videos/search?q=${encodeURIComponent(query)}`, {
        state: { videos: response.videos },
      });
    } else {
      alert("Please enter a search query.");
    }
  };
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
