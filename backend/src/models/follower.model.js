import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const followerSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

})
const followerModel = mongoose.model("Follower", followerSchema);
export default followerModel;