import User from "../models/user.model.js";
import Text from "../models/text.model.js";


const uploadtxt = async (req, res, next) => {
    if(!req.body?.text) return res.status(400).json({error : 'Please provide text'});
    let post = req.body.text;
    let userId = req.user._id
    let user = await User.findById(userId);
    if(!user) return res.status(401).json({error : 'Invalid access token'});
    let text = await Text.create({
          userId, post
        });
    await text.save();
    user.texts.push(text._id);
    await user.save();

    res.status(201).json({success : true, message : 'Text uploaded successfully', text});
}

const likecount = async (req, res, next) => {
    try{
        let text = await Text.findById(req.params.id);   
        let user = await User.findById(req.user._id);

        if(!text) return res.status(404).json({error : 'Text not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
    
        if(user.likedtexts.includes(req.params.id)){
            text.likecount--;
            await text.save();
            user.likedtexts = user.likedtexts.filter((txt) => txt.toString() !== req.params.id);
            await user.save();
            return res.status(200).json({success : true, message : 'Likecount decremented successfully', text});
        }

        text.likecount++;
        await text.save();
        user.likedtexts.push(req.params.id);
        await user.save();

        res.status(200).json({success : true, message : 'Likecount incremented successfully', text});
    } catch(e) {next(e);}
}

const sharecount = async (req, res, next) => {
    try{
        let text = await Text.findByIdAndUpdate(req.params.id, {
            $inc : {sharecount : 1}},
            {new : true}
        )

        if(!text) return res.status(404).json({error : 'Text not found'});
        res.status(200).json({success : true, message : 'Sharecount incremented successfully', text});
    }catch(e){next(e);}
}

const deltxt = async (req, res, next) => {
    try{
        let text = await Text.findById(req.params.id);    
        let user = await User.findById(req.user._id);

        if(!text) return res.status(404).json({error : 'Text not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(!user.texts.some(id => id.equals(req.params.id))) return res.status(403).json({error : "Text doesn't belong to the user"});
        
        user.texts = user.texts.filter((txt) => txt.toString() !== req.params.id);
        
        await user.save();
        await text.deleteOne();
        res.status(200).json({success : true, message : 'Text deleted successfully'});
    }catch(e){next(e);}
}

const edittxt = async (req, res, next) => {
    try{
        let text = await Text.findById(req.params.id);    
        let user = await User.findById(req.user._id);

        if(!text) return res.status(404).json({error : 'Text not found'});
        if(!user) return res.status(401).json({error : 'Invalid access token'});
        if(!user.texts.some(id => id.equals(req.params.id))) return res.status(403).json({error : "Text doesn't belong to the user"});

        if(!req.body?.text) return res.status(400).json({error : 'Please provide edited text'});
        text.post = req.body.text;
        await text.save();
        res.status(200).json({success : true, message : 'Text edited successfully'});

    }catch(e){next(e);}
}

export {uploadtxt, likecount, sharecount, deltxt, edittxt};