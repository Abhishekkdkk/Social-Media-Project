import { useNavigate } from "react-router-dom";
import "./NavBar.css";
function NavBar() {
  const navigate = useNavigate();

  const handleClick = (page) => {
    navigate(`/${page}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-item" onClick={() => handleClick("home")}>
        Home
      </div>

      <div className="nav-item" onClick={() => handleClick("Friends")}>
        Friends
      </div>

      <div className="nav-item" onClick={() => handleClick("Videos")}>
        Videos
      </div>

      <div className="nav-item" onClick={() => handleClick("Notifications")}>
        Notifications
      </div>
      <div className="nav-item" onClick={() => handleClick("Chats")}>
        Chats
      </div>
    </nav>
  );
}

export default NavBar;
