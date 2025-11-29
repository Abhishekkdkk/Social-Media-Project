import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import {delfile, isImage} from '../utils/helper.js';
import {uploadtocloudinary, delfromcloudinary} from "../utils/cloudinary.js";

const uploadpost = async (req, res, next) => {
    let imgDetails = [];
    try{
        if(!req.files || req.files.length === 0){
            if(!req.body?.text) return res.status(400).json({error : 'Please provide image(s) or text'});
            let text = req.body.text;
            let userId = req.user._id
            let user = await User.findById(userId);
            if(!user) return res.status(401).json({error : 'Invalid access token'});
            let post = await Post.create({
                userId, text
            });
            await post.save();
            user.posts.push(post._id);
            await user.save();

            return res.status(201).json({success : true, message : 'Text uploaded successfully', post});
        }
        let AllAreImg = req.files.every(file => isImage(file));
        if(!AllAreImg)
        {
            for(let i = 0; i < req.files.length; i++){
                delfile(req.files[i].filename);
            }
            return res.status(400).json({error : 'Image(s) must be image file'});
        }
        
        let text = req.body?.text ?? '';
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
        let post = await Post.create({
            userId, text, imgDetails
        });
        await post.save();
        user.posts.push(post._id);
        await user.save();

        res.status(201).json({success : true, message : 'Image(s) uploaded successfully', post});
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
        let post = await Post.findById(req.params.id);   
        let user = await User.findById(req.user._id);

        if(!post) return res.status(404).json({error : 'Post not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(user.likedposts.includes(req.params.id)) return res.status(400).json({error : 'User already likes the post'});

        post.likecount++;
        await post.save();
        user.likedposts.push(req.params.id);
        await user.save();

        res.status(200).json({success : true, message : 'Likecount incremented successfully', post});
    } catch(e) {next(e);}

}

const unlike = async (req, res, next) => {
    try{
        let post = await Post.findById(req.params.id);   
        let user = await User.findById(req.user._id);

        if(!post) return res.status(404).json({error : 'Post not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(!user.likedposts.includes(req.params.id)) return res.status(400).json({error : "User hasn't liked the post"});
        post.likecount--;
        await post.save();
        user.likedposts = user.likedposts.filter((img) => img.toString() !== req.params.id);
        await user.save();
    }catch(e){next(e);}
}

const sharecount = async (req, res, next) => {
    try{
        let post = await Post.findByIdAndUpdate(req.params.id, {
            $inc : {sharecount : 1}},
            {new : true}
        )

        if(!post) return res.status(404).json({error : 'Post not found'});
        res.status(200).json({success : true, message : 'Sharecount incremented successfully', post});
    }catch(e){next(e);}
}

const delpost = async (req, res, next) => {
    try{
        let post = await Post.findById(req.params.id);    
        let user = await User.findById(req.user._id);

        if(!post) return res.status(404).json({error : 'Post not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(!user.posts.some(id => id.equals(req.params.id))) return res.status(403).json({error : "Post doesn't belong to the user"});
        if(post.imgDetails){
            try{
                for(let i = 0; i < post.imgDetails.length; i++) {
                    if(post.imgDetails[i]?.public_id) await delfromcloudinary(post.imgDetails[i].public_id);

            }
        }catch(e){
                return res.status(500).json({error : 'Cannot Delete post'});
            }
        }
        
        user.posts = user.posts.filter((img) => img.toString() !== req.params.id);
        
        await user.save();
        await Post.findByIdAndDelete(post._id);

        await User.updateMany(
            {likedposts : post._id},
            {$pull : {likedposts : post._id}}
        )

        res.status(200).json({success : true, message : 'Post deleted successfully'});
    }catch(e){next(e);}
}

const addcomment = async (req, res, next) => {
    try{
        let user = await User.findById(req.user._id);
        if(!user) return res.status(401).json({error : 'Invalid refresh token'});
        let post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error : 'Post not found'});
        if(!req.body?.comment) return res.status(400).json({error : 'Comment must be sent'});

        let newcomment = {userId : user._id, text : req.body.comment};
        post.comments.push(newcomment);
        await post.save();
        let cmt = post.comments;

        res.status(200).json({success : true, message : 'New comment added', commentcount : cmt.length, comments : cmt});

    }catch(e){next(e);}
}

const delcomment = async (req, res, next) => {
    try{
        let user = await User.findById(req.user._id);
        if(!user) return res.status(401).json({error : 'Invalid refresh token'});
        let post = await Post.findById(req.params.postid);
        if(!post) return res.status(404).json({error : 'Post not found'});
        let cmt = post.comments.id(req.params.cmtid);
        if(!cmt) return res.status(404).json({error : 'Comment not found'});
        if(!cmt.userId.equals(req.user._id)) return res.status(403).json({error : "Comment doesn't belong to the user"});
        post.comments = post.comments.filter(c => !c._id.equals(cmt._id));
        await post.save();

        cmt = post.comments;
        res.status(200).json({success : true, message : 'Comment deleted successfully', commentcount : cmt.length, comments : cmt});
    } catch(e){next(e);}
}

const editcomment =  async (req, res, next) => {
    try{
        let user = await User.findById(req.user._id);
        if(!user) return res.status(401).json({error : 'Invalid refresh token'});
        let post = await Post.findById(req.params.postid);
        if(!post) return res.status(404).json({error : 'Post not found'});
        let cmt = post.comments.id(req.params.cmtid);
        if(!cmt) return res.status(404).json({error : 'Comment not found'});
        if(!req.body?.comment) return res.status(400).json({error : 'New edited comment must be sent'});
        if(!cmt.userId.equals(req.user._id)) return res.status(403).json({error : "Comment doesn't belong to the user"});

        cmt.text = req.body.comment;
        await post.save();

        res.status(200).json({success : true, message : 'Comment edited successfully', commentcount : post.comments.length, editedcomment : cmt});
    }catch(e){next(e);}
}

const edittxt = async (req, res, next) => {
    try{
        let post = await Post.findById(req.params.id);    
        let user = await User.findById(req.user._id);

        if(!post || !post.text) return res.status(404).json({error : 'Text not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(!user.posts.some(id => id.equals(req.params.id))) return res.status(403).json({error : "Post doesn't belong to the user"});

        if(!req.body?.text) return res.status(400).json({error : 'Please provide edited text'});
        post.text = req.body.text;
        await post.save();
        res.status(200).json({success : true, message : 'Text edited successfully', post});

    }catch(e){next(e);}
}

export {uploadpost, likecount, unlike, sharecount, delpost, addcomment, delcomment, editcomment, edittxt};