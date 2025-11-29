import User from '../models/user.model.js';
import {cloudinary, uploadtocloudinary, delfromcloudinary} from "../utils/cloudinary.js";
import path from 'path';
import {delfile, isImage} from '../utils/helper.js';
import jwt from 'jsonwebtoken';

const registeruser = async (req, res, next) => {
    if(!req.body) return res.status(400).json({error : 'Fields cannot be empty'});
    if(!req.file) return res.status(400).json({error : 'Avatar must be sent'});
    let avatar = req.file.filename;
    if(!isImage(req.file)){
        delfile(avatar);
        return res.status(400).json({error : 'Avatar must be a image file'});
    }

    let {username, email, password} = req.body;
    
    if(!username){
        delfile(avatar);
        return res.status(400).json({error : 'Username cannot be empty'});
    }
    if(!email){
        delfile(avatar); return res.status(400).json({error : 'Email cannot be empty'});
    }
    if(!password){
        delfile(avatar); return res.status(400).json({error : 'Password cannot be empty'});
    }
    
    try{
        let matchusername = await User.findOne({username : username});
        if(matchusername) return res.status(401).json({error : 'Username already used'});
        let matchemail = await User.findOne({email : email});
        if(matchemail) return res.status(401).json({error : 'Email already used'});

    

        let filepath = path.join(process.cwd(), 'uploads', avatar);
        //   process.cwd() = __dirname for es6

        const result = await uploadtocloudinary(filepath);
        let imgurl = {url : result.secure_url, public_id : result.public_id};

        
        let user = await User.create({
            username, email, password, avatar : imgurl
        });
        let refreshToken = await user.generateRefreshToken();
        let accessToken = await user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save();
        
        res.status(201).cookie('refreshToken', refreshToken, {
            httpOnly : true,
            secure : true,
            maxAge : 7 * 24 * 60 * 60 * 1000,
            sameSite : 'strict'
        } )
        .cookie('accessToken', accessToken, {
            httpOnly : true,
            secure : true,
            maxAge : 24 * 60 * 60 * 1000,
            sameSite : 'strict'
        } )
        .json({success : true, message : 'User registration successful'});
    }
    catch(e){next(e);}
}

const loginuser = async (req, res, next) => {
    if(!req.body) return res.status(400).json({error : 'Fields cannot be empty'});
    let {email, password} = req.body;
    if(!email) return res.status(400).json({error : 'Email cannot be empty'});
    if(!password) return res.status(400).json({error : 'Password cannot be empty'});
    try{
        let user = await User.findOne({email : email});
        if(!user) return res.status(404).json({error : 'User not found'});
        let check = await user.isPasswordCorrect(password);
        if(!check) return res.status(401).json({error : 'Incorrect password'});
        let accessToken = await user.generateAccessToken();
        let refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly : true,
            secure : true,
            maxAge : 7 * 24 * 60 * 60 * 1000,
            sameSite : 'strict'
        } )
        .cookie('accessToken', accessToken, {
            httpOnly : true,
            secure : true,
            maxAge : 24 * 60 * 60 * 1000,
            sameSite : 'strict'
        } )
        .json({success : true, message : 'User login successful'});
    }
    catch(e){next(e);}
}

const logoutuser = async(req, res, next) => {
    try{
        let user = await User.findByIdAndUpdate(req.user._id, {refreshToken : null});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        let options = {httpOnly : true, secure : true, sameSite : 'strict'}
        res.status(200)
        .clearCookie('refreshToken', options)
        .clearCookie('accessToken', options)
        .json({success : true, message : 'User logout successful'});
}
catch(e){next(e);}
}

const refreshAccessToken = async(req, res, next) => {
     try{
        const givenToken = req.cookies.refreshToken;
        if(!givenToken) return res.status(403).json({error : 'No refresh token'});
    
        let decoded = jwt.verify(givenToken, process.env.REFRESH_TOKEN_SECRET);
        
        let user = await User.findById(decoded._id);
        if(!user || givenToken !== user.refreshToken) return res.status(401).json({error : 'Invalid refresh token'});
        let accessToken = await user.generateAccessToken();
        let refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly : true,
            secure : true,
            maxAge : 7 * 24 * 60 * 60 * 1000,
            sameSite : 'strict'
        } )
        .cookie('accessToken', accessToken, {
            httpOnly : true,
            secure : true,
            maxAge : 24 * 60 * 60 * 1000,
            sameSite : 'strict'
        } )
        .json({success : true, message : 'Token refreshed successfully'});

    }catch(e){next(e);}
}

const changepw = async(req, res, next) => {
    try{
        if(!req.body) return res.status(400).json({error : 'Fields cannot be empty'});
    let {newpassword, oldpassword} = req.body;
    if(!oldpassword) return res.status(400).json({error : 'Old password required'});
    if(!newpassword) return res.status(400).json({error : 'New password required'});
    if(oldpassword === newpassword) return res.status(400).json({error : 'New password cannot be same as old password'});
    let user = await User.findById(req.user._id);

    let match = await user.isPasswordCorrect(oldpassword);
    if(!user) return res.status(403).json({error : 'User not found'});
    if(!match) return res.status(401).json({error : 'Old password incorect'});
    user.password = newpassword;
    await user.save();
    res.status(200).json({success : true, message : 'Password changed successfully'});
    }catch(e){next(e);}

}

const changeAvatar = async(req, res, next) => {
    try{
        if(!req.file) return res.status(400).json({error : 'Avatar must be sent'});
        if(!isImage(req.file)){
            delfile(req.file.filename);
            return res.status(400).json({error : 'Avatar must be a image file'});
        }
        let user = await User.findById(req.user._id);
         let avatar = req.file.filename;
        if(!user || !user.avatar?.public_id){ delfile(avatar); return res.status(404).json({error : 'Avatar not found'});}
        await delfromcloudinary(user.avatar.public_id);

        user.avatar = null;

        let filepath = path.join(process.cwd(), 'uploads', avatar);
        //   process.cwd() = __dirname for es6

        const result = await uploadtocloudinary(filepath);
        let img = {url : result.secure_url, public_id : result.public_id};

        
        user.avatar = img;
        await user.save();
        res.status(200).json({success : true, message : 'Avatar changed successfully'});

    }catch(e){next(e);}
}



export {registeruser, loginuser, logoutuser, refreshAccessToken, changepw, changeAvatar, };