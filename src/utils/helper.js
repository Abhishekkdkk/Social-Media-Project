import path from 'path';
import fs from 'fs';

function delfile(filename){
    let filepath = path.join(process.cwd(), 'uploads', filename);
    //   process.cwd() = __dirname for es6
    if(fs.existsSync(filepath)) fs.unlinkSync(filepath);
}

const isImage = (file) => file?.mimetype?.startsWith('image/');
const isVideo = (file) => file?.mimetype?.startsWith('video/');

export {delfile, isImage, isVideo};