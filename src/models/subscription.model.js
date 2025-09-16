import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const subscription=new mongoose.Schema({
    subscribers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

})
const subscriptionModel=mongoose.model("Subscription",subscription);
export default subscriptionModel;