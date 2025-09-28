import User from "../models/user.model.js";
import Image from "../models/image.model.js";
import {delfile} from '../utils/helper.js';
import {uploadtocloudinary, delfromcloudinary} from "../utils/cloudinary.js";

const uploadimg = async (req, res, next) => {
    let imgDetails = [];
    try{
        if(!req.files) return res.status(400).json({error : 'Images should be sent'});
        if(!req.body?.title){
            for(let i = 0; i < req.files.length; i++){
            if(req.files[i]) delfile(req.files[i].filename)
            }
            return res.status(400).json({error : 'Title must be given'});
        }
        let {title} = req.body;
        let userId = req.user._id;
        let user = await User.findById(userId);
        if(!user){
            for(let i = 0; i < req.files.length; i++){
            if(req.files[i]) delfile(req.files[i].filename);
            }
            return res.status(401).json({error : 'Invalid access token'});
        }
        
        for(let i = 0; i < req.files.length; i++){
            let result =  await uploadtocloudinary(req.files[i].path);
            let imgobj = {
                url : result.secure_url,
                public_id : result.public_id
            };
            imgDetails.push(imgobj); 
        }
        let image = await Image.create({
            userId, title, imgDetails
        });
        await image.save();
        user.images.push(image._id);
        await user.save();

        res.status(201).json({success : true, message : 'Image(s) uploaded successfully', image});
    }catch(e){
        for(let i = 0; i < req.files.length; i++){
            if(req.files[i]) delfile(req.files[i].filename)
            if(imgDetails[i]?.public_id) delfromcloudinary(imgDetails[i]?.public_id);
        }
        next(e);
    }
}

const likecount = async (req, res, next) => {
    try{
        let image = await Image.findById(req.params.id);   
        let user = await User.findById(req.user._id);

        if(!image) return res.status(404).json({error : 'Image not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
    
        if(user.likedimages.includes(req.params.id)){
            image.likecount--;
            await image.save();
            user.likedimages = user.likedimages.filter((img) => img.toString() !== req.params.id);
            await user.save();
            return res.status(200).json({success : true, message : 'Likecount decremented successfully', image});
        }

        image.likecount++;
        await image.save();
        user.likedimages.push(req.params.id);
        await user.save();

        res.status(200).json({success : true, message : 'Likecount incremented successfully', image});
    } catch(e) {next(e);}

}

const sharecount = async (req, res, next) => {
    try{
        let image = await Image.findByIdAndUpdate(req.params.id, {
            $inc : {sharecount : 1}},
            {new : true}
        )

        if(!image) return res.status(404).json({error : 'Image not found'});
        res.status(200).json({success : true, message : 'Sharecount incremented successfully', image});
    }catch(e){next(e);}
}

const delimg = async (req, res, next) => {
    try{
        let image = await Image.findById(req.params.id);    
        let user = await User.findById(req.user._id);

        if(!image) return res.status(404).json({error : 'Image not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(!user.images.some(id => id.equals(req.params.id))) return res.status(403).json({error : "Image(s) don't belong to the user"});
        try{
            for(let i = 0; i < image.imgDetails.length; i++) {
                if(image.imgDetails[i]?.public_id)await delfromcloudinary(image.imgDetails[i].public_id);
            }
        }catch(e){
            return res.status(500).json({error : 'Cannot Delete image'});
        }
        
        user.images = user.images.filter((img) => img.toString() !== req.params.id);
        
        await user.save();
        await image.deleteOne();
        res.status(200).json({success : true, message : 'Image deleted successfully'});
    }catch(e){next(e);}
}

export {uploadimg, likecount, sharecount, delimg};