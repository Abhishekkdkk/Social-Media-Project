import "./AddFriendCart.css";
import { sendFriendRequest, removeSuggestion } from "../services/FriendService";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../redux/loaderSlice";

const AddFriendCart = ({ user, onRemove }) => {
  const dispatch = useDispatch();

  return (
    <div className="add-friend-cart">
      <div className="left-side">
        <img src={user?.avatar?.url} alt="avatar" />

        <div className="user-info">
          <div className="name">{user.username}</div>
          <div className="mutuals">
            {user.mutualFriendsCount ?? 0} mutual friends
          </div>
        </div>
      </div>

      <div className="actions">
        <button
          className="add"
          onClick={async () => {
            onRemove(user._id); // Optimistically remove the suggestion
            try {
              dispatch(showLoader());
              await sendFriendRequest(user.username);
            } finally {
              dispatch(hideLoader());
            }
          }}
        >
          Add Friend
        </button>

        <button
          className="remove"
          onClick={async () => {
            try {
              dispatch(showLoader());
              await removeSuggestion(user._id);
              onRemove(user._id);
            } finally {
              dispatch(hideLoader());
            }
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default AddFriendCart;
