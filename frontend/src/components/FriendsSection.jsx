import NavBar from "../assets/NavBar";
import AddFriendCart from "../assets/AddFriendCart";
import { friendSuggestions } from "../services/FriendService";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../assets/Loader";
function FriendsSection() {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      const data = await friendSuggestions();
      setSuggestions(data);
    };
    fetchSuggestions();
  }, []);
  const loading = useSelector((state) => state.loader.loading);
  //console.log("Friend suggestions in component:", suggestions);
  const handleRemove = (id) => {
    setSuggestions((prev) => prev.filter((u) => u._id !== id));
  };
  return (
    <div>
      {loading && <Loader show={loading} />}
      <NavBar />
      {suggestions.length === 0 ? (
        <p className="p-5">No friend suggestions available</p>
      ) : (
        suggestions.map((user) => (
          <AddFriendCart key={user._id} user={user} onRemove={handleRemove} />
        ))
      )}
    </div>
  );
}
export default FriendsSection;
