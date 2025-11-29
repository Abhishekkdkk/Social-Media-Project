import mongoose from 'mongoose';

const postschema = new mongoose.Schema({
    userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
    text : {
        type : String,
        
    },
    uploadDate : {
        type : Date,
        default : Date.now
    },
    imgDetails : [
        {
            url : String,
            public_id : String
        }
    ],
    likecount : {
        type : Number,
        default : 0
    },
    sharecount : {
        type : Number,
        default : 0
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

let Post = mongoose.model('Post', postschema);
export default Post;