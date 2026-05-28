import "./UserDisplay.css";

function UserDisplay({ user }) {
  const name = user?.otherMember?.username || user?.username;
  const avatar = user?.otherMember?.avatar?.url || user?.avatar?.url;

  const lastMessage =
    typeof user?.lastMessage === "object"
      ? user?.lastMessage?.text
      : user?.lastMessage || "No messages yet";

  return (
    <div className="user-display">

      <div className="image">
        <img src={avatar} alt={name} />
      </div>

      <div className="body">

        <div className="user-info">

          <div className="user-name">
            {name}
          </div>

          <div className="last-message">
            {lastMessage}
          </div>

        </div>

        <div className="online-status"></div>

      </div>
    </div>
  );
}

export default UserDisplay;