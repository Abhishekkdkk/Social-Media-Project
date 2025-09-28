import mongoose from "mongoose";

const vdoschema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title : {
        type : String,
        required : true,
    },
    thumbnail : {
        url : String,
        public_id : String
    },
    description : {
        type : String,
        required : true,
    },
    videoDetails : { 
        url : {
        type : String,
        required : true,
    },
        public_id : {
        type : String,
        required : true,
    }
    },
    uploadDate : {
        type : Date,
        default : Date.now
    },
    viewcount : {
        type : Number,
        default : 0,
    },
    likecount : {
        type : Number,
        default : 0,
    },
    sharecount : {
        type : Number,
        default : 0,
    },
    comments : [{
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        text : {
            type : String,
            required : true
        },
        uploadDate : {type : Date, default : Date.now}
    }]
});

let Video = mongoose.model('Video', vdoschema);
export default Video;