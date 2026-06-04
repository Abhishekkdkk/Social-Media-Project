import "./NavBar.css";
import { Home, Users, Video, MessageCircle, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="LeftSection">Social</div>
      <div className="MiddleSection">
        <div className="nav-item" onClick={() => navigate("/home")}>
          <Home />
        </div>
        <div className="nav-item" onClick={() => navigate("/Friends")}>
          <Users />
        </div>
        <div className="nav-item" onClick={() => navigate("/Videos")}>
          <Video />
        </div>
        <div className="nav-item" onClick={() => navigate("/Chats")}>
          <MessageCircle />
        </div>
      </div>
      <div className="RightSection">
        <div className="nav-item" onClick={() => navigate("/Notifications")}>
          <Bell />
        </div>
        <div className="nav-item" onClick={() => navigate("/Profile")}>
          <User />
        </div>
      </div>
    </div>
  );
}
