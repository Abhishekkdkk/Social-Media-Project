import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }],
    followings : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        default : []
    }],
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    refreshToken: {
        type: String,
        default: null
    },
    avatar : {
        url: String, 
        public_id : String
    },
    videos : {
        type : Array,
        default : []
    },
    likedvideos : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    images : {
        type : Array,
        default : []
    },
    likedimages : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    }],
    texts : {
        type : Array,
        default : []
    },
    likedtexts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Text',
    }]
    
},{timestamps: true});
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);//RETURNS TRUE OR FALSE
}
userSchema.methods.generateAccessToken = async function() {
    return await jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}
userSchema.methods.generateRefreshToken = async function() {
    return await jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}
const User = mongoose.model("User", userSchema);
export default User;
