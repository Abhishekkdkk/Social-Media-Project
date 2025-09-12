import path from 'path';
import {promises as fs} from 'fs';

async function delfile(filename){
    let filepath = path.join(process.cwd(), 'uploads/useravatar', filename);
    //   process.cwd() = __dirname for es6
    await fs.unlink(filepath)
}

export {delfile};