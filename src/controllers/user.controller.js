import mongoose from "mongoose";
import connectDB from "../db/index.js";
import User from '../models/user.model.js';
import cloudinary from "../utils/cloudinary.js";
import path from 'path';
import {delfile} from '../utils/helper.js';
connectDB();

let registeruser = async (req, res, next) => {
    if(!req.body) return res.status(400).send('Fields cannot be empty');
    if(!req.file) return res.status(400).send('Avatar must be sent');
    let {username, email, password} = req.body;
    let avatar = req.file.filename;
    if(!username) {delfile(avatar); return res.status(400).send('Username cannot be empty');}
    if(!email) {delfile(avatar); return res.status(400).send('Email cannot be empty');}
    if(!password) {delfile(avatar); return res.status(400).send('Password cannot be empty');}
    

    try{
        let matchusername = await User.findOne({username : username});
        if(matchusername) return res.status(401).send('Username already used');
        let matchemail = await User.findOne({email : email});
        if(matchemail) return res.status(401).send('Email already used');

    

        let filepath = path.join(process.cwd(), 'uploads/useravatar', avatar);
        //   process.cwd() = __dirname for es6

        const result = await cloudinary.uploader.upload(filepath);
        let imgurl = result.secure_url;

        delfile(avatar);

        let user = await User.create({
            username, email, password, avatar : imgurl
        });
        let accessToken = await user.generateAccessToken();
        res.status(200).json({success : true, message : 'User registration completed', accessToken, refreshToken : user.refreshToken});
    }
    catch(e){next(e);}
}

let loginuser = async (req, res, next) => {
    if(!req.body) return res.status(400).send('Fields cannot be empty');
    let {email, password} = req.body;
    if(!email) return res.status(400).send('Email cannot be empty');
    if(!password) return res.status(400).send('Password cannot be empty');
    try{
        let user = await User.findOne({email : email});
        if(!user) return res.status(404).send('User not found');
        let check = await user.isPasswordCorrect(password);
        if(!check) return res.status(401).send('Incorrect password');
        let accessToken = await user.generateAccessToken();
        let refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({success : true, message : 'User login successful', accessToken, refreshToken});
    }
    catch(e){next(e);}
}

let logoutuser = async(req, res, next) => {
    try{
    if(!req.body) return res.status(401).send('Enter refresh token');
    let {refreshToken} = req.body;
    
    
    let user = await User.findOne({refreshToken});
    if(!user) return res.status(401).send('Incorrect refresh token');
    user.refreshToken = null;
    await user.save();
}
catch(e){next(e);}
}

export {registeruser, loginuser, logoutuser};