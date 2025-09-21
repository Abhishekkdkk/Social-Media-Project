import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

 async function delfromcloudinary(public_id) {
    try{
    if(!public_id) return null;
    await cloudinary.uploader.destroy(public_id);
    }catch(e){throw e;}
}

 async function uploadtocloudinary(filepath) {
    try{
        if(!filepath) return null;
        const result = await cloudinary.uploader.upload(filepath);
        fs.unlinkSync(filepath);
        return result;
    }catch(e){fs.unlinkSync(filepath); throw e;}
}

export  {cloudinary, delfromcloudinary, uploadtocloudinary};