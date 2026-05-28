import mongoose from "mongoose";
const friendshipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
friendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });
const Friendship = mongoose.model("Friendship", friendshipSchema);

export default Friendship;
