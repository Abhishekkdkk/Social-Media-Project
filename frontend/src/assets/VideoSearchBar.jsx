import { useNavigate } from "react-router";
import { useState } from "react";
import "../assets/VideoSearchBar.css";
import { queryVideo } from "../services/VideoServices";

export default function VideoSearchBar({ setVideos }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const upload = () => {
    navigate("/upload");
  };

  const search = async () => {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    const response = await queryVideo(trimmed);

    // update VideoSection directly
    setVideos(response.videos);
  };

  return (
    <div className="search-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search videos..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />

        <button className="search-button" onClick={search}>
          🔍
        </button>
      </div>

      <button className="upload-button" onClick={upload}>
        Upload
      </button>
    </div>
  );
}
