import path from 'path';
import fs from 'fs';

function delfile(filename){
    let filepath = path.join(process.cwd(), 'uploads', filename);
    //   process.cwd() = __dirname for es6
    fs.unlinkSync(filepath)
}

export {delfile};