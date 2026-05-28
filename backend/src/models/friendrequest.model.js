import mongoose from "mongoose";
const friendrequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        
    },{
        timestamps: true,
    }

);
    friendrequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
const FriendRequest = mongoose.model("FriendRequest", friendrequestSchema);

export default FriendRequest;