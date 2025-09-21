import path from 'path';
import fs from 'fs';

async function delfile(filename){
    let filepath = path.join(process.cwd(), 'uploads/useravatar', filename);
    //   process.cwd() = __dirname for es6
    fs.unlinkSync(filepath)
}

export {delfile};