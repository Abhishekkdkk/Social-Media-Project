import NavBar from "../assets/NavBar";
import AddFriendCart from "../assets/AddFriendCart";
import { friendSuggestions } from "../services/FriendService.js";
import { searchUsers } from "../services/ChatServices.js";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../assets/Loader";

function FriendsSection() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showEmpty, setShowEmpty] = useState(false);

  const loading = useSelector((state) => state.loader.loading);

  // initial load
  useEffect(() => {
    const fetchSuggestions = async () => {
      const data = await friendSuggestions();
      setUsers(data || []);
    };
    fetchSuggestions();
  }, []);

  // search logic
  useEffect(() => {
    const delay = setTimeout(async () => {
      const trimmed = search.trim();

      let data = [];

      if (trimmed === "") {
        data = await friendSuggestions();
      } else {
        data = await searchUsers(trimmed);
      }

      setUsers(data || []);

      // handle delayed "no users found"
      if (!data || data.length === 0) {
        setShowEmpty(false);

        setTimeout(() => {
          setShowEmpty(true);
        }, 2000);
      } else {
        setShowEmpty(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const handleRemove = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="friends-page">
      {loading && <Loader show={loading} />}

      <NavBar />

      <div className="friends-content">
        {/* SEARCH BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
            background: "#000",
          }}
        >
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "14px 16px",

              backgroundColor: "#111",
              color: "#fff",

              border: "2px solid #fff",
              borderRadius: "12px",

              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        {/* USERS */}
        {users.length > 0
          ? users.map((user) => (
              <AddFriendCart
                key={user._id}
                user={user}
                onRemove={handleRemove}
              />
            ))
          : showEmpty && (
              <p
                style={{
                  color: "#aaa",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                No users found
              </p>
            )}
      </div>
    </div>
  );
}

export default FriendsSection;
