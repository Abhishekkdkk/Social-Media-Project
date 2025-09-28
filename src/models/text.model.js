import mongoose from "mongoose";

const txtschema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    post : {
        type : String,
        required : true
    },
    uploadDate : {
        type : Date,
        default : Date.now
    },
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
        uploadDate : {
            type : Date,
            default : Date.now
        }
    }]
});

let Text = mongoose.model('Text', txtschema);
export default Text;