import { useNavigate } from "react-router";
function NavBar() {
  const navigate = useNavigate();
  const handleClick = (page) => {
    console.log(`Navigating to ${page}`);
    navigate(`/${page}`);
  };

  return (
    <nav className="bg-violet-400 p-3 flex w-full border-2 border-gray-600 text-black">
      <div className="m-5 flex-1" onClick={() => handleClick("home")}>
        Home
      </div>
      <div className="m-5 flex-1" onClick={() => handleClick("Friends")}>
        Friends
      </div>
      <div className="m-5 flex-1" onClick={() => handleClick("Videos")}>
        Videos
      </div>
      <div className="m-5 flex-1" onClick={() => handleClick("Notifications")}>
        Notifications
      </div>
    </nav>
  );
}
export default NavBar;
