import mongoose from "mongoose";
import Video from '../models/video.model.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import {delfile} from '../utils/helper.js';
import {uploadtocloudinary, delfromcloudinary} from "../utils/cloudinary.js";

const uploadvdo = async (req, res, next) => {
    let vdoresult, thumbnail_result;
    try{
        if(!req.files?.vdo || !req.files?.thumbnail) return res.status(400).json({error : 'Video and thumbnail must be sent'});
        if(!req.body?.title || !req.body?.description) {
            delfile(req.files.vdo[0].filename);
            delfile(req.files.thumbnail[0].filename);
            return res.status(400).json({error : 'Title and description must be sent'});
        }
        let {title, description} = req.body;
        let userId = req.user._id;

        let user = await User.findById(userId);
        if(!user){
            delfile(req.files.vdo[0].filename);
            delfile(req.files.thumbnail[0].filename);
         return res.status(401).json({error : 'Invalid access Token'});
        }

        vdoresult = await uploadtocloudinary(req.files.vdo[0].path);
        thumbnail_result = await uploadtocloudinary(req.files.thumbnail[0].path);

        let video = await Video.create({
            userId,
            title,
            description,
            videoDetails : {url : vdoresult.secure_url, public_id : vdoresult.public_id},
            thumbnail : {url : thumbnail_result.secure_url, public_id : thumbnail_result.public_id}
        });
        await video.save();

        user.videos.push(video._id);
        await user.save({validateBeforeSave : false});
        res.status(201).json({success : true, message : 'Video uploaded successfully', video});

    }catch(e) {
        if(req.files?.vdo) delfile(req.files.vdo[0].filename);
        if(req.files.thumbnail) delfile(req.files.thumbnail[0].filename);
        if(vdoresult?.public_id) await delfromcloudinary(vdoresult.public_id);
        if(thumbnail_result?.public_id) await delfromcloudinary(thumbnail_result.public_id);
        next(e);
    }
}


const viewcount = async (req, res, next) => {
    try{
        let token = req.cookies.accessToken;
        if(token){
            try{
                let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                req.user = decoded;
            } catch(e){
                req.user = null;
            }
        }
        let video = await Video.findByIdAndUpdate(req.params.id,
            {$inc : {viewcount : 1}},
            {new : true}
        )
        if(!video) return res.status(404).json({error : 'Video not found'});

        if(req.user){
            let user = await User.findById(req.user._id);
            if(user){
            user.watchHistory = user.watchHistory.filter((video) => video.toString() !== req.params.id);
            user.watchHistory.push(req.params.id);
            await user.save();
            }
        }
        res.status(200).json({success : true, message : 'Viewcount incremented successfully', video}); 
    } catch(e) {next(e);}
}

const likecount = async (req, res, next) => {
    try{
        let video = await Video.findById(req.params.id);    
        let user = await User.findById(req.user._id);

        if(!video) return res.status(404).json({error : 'Video not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
    
        if(user.likedvideos.includes(req.params.id)){
            video.likecount--;
            await video.save();
            user.likedvideos = user.likedvideos.filter((video) => video.toString() !== req.params.id);
            await user.save();
            return res.status(200).json({success : true, message : 'Likecount decremented successfully', video});
        }

        video.likecount++;
        await video.save();
        user.likedvideos.push(req.params.id);
        await user.save();

        res.status(200).json({success : true, message : 'Likecount incremented successfully', video});
    } catch(e) {next(e);}

}

const delvdo = async (req, res, next) => {
    try{
        let video = await Video.findById(req.params.id);    
        let user = await User.findById(req.user._id);

        if(!video) return res.status(404).json({error : 'Video not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(!user.videos.some(id => id.equals(req.params.id))) return res.status(403).json({error : "Video doesn't belong to the user"});
        try{
            await delfromcloudinary(video.videoDetails.public_id);
        }catch(e){
            return res.status(500).json({error : 'Cannot Delete Video'});
        }
        await delfromcloudinary(video.thumbnail.public_id);

        user.videos = user.videos.filter((vdo) => vdo.toString() !== req.params.id);
        
        await user.save();
        await video.deleteOne();
        res.status(200).json({success : true, message : 'Video deleted successfully'});
    }catch(e){next(e);}
}

const sharecount = async (req, res, next) => {
    try{
        let video = await Video.findByIdAndUpdate(req.params.id, {
            $inc : {sharecount : 1}},
            {new : true}
        )

        if(!video) return res.status(404).json({error : 'Video not found'});
        res.status(200).json({success : true, message : 'Sharecount incremented successfully', video});
    }catch(e){next(e);}
}

const changethumbnail = async (req, res, next) => {
    try{
        if(!req.file) return res.status(400).json({error : 'Thumbnail must be sent'});
        let thumbnail = req.file.filename;
        let user = await User.findById(req.user._id);
        if(!user){
            delfile(thumbnail); 
            return res.status(401).json({error : 'Invalid access token'});
        }
        if(!user.videos.some(id => id.equals(req.params.id))){
            delfile(thumbnail);
             return res.status(403).json({error : "Video doesn't belong to the user"});
        }
        let video = await Video.findById(req.params.id);
        
        if(!video || !video.thumbnail?.public_id){
            delfile(thumbnail); 
            return res.status(404).json({error : 'Thumbnail not found'});
        }
        try{
            await delfromcloudinary(video.thumbnail.public_id);
        }catch(e){
            return res.status(500).json({error : 'Cannot change thumbnail'}); 
        }
        let filepath = req.file.path;
        const result = await uploadtocloudinary(filepath);
        let imgurl = {url : result.secure_url, public_id : result.public_id};

        
        video.thumbnail = imgurl;
        await video.save();
        res.status(200).json({success : true, message : 'Thumbnail changed successfully'}, video);

    }catch(e){
        if(req.file) delfile(req.file.filename);
        next(e);
    }
}

export {uploadvdo, viewcount, likecount, delvdo, sharecount, changethumbnail};