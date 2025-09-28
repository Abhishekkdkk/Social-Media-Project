import mongoose from 'mongoose';

const imgschema = new mongoose.Schema({
    userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
    title : {
        type : String,
        required : true
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

let Image = mongoose.model('Image', imgschema);
export default Image;