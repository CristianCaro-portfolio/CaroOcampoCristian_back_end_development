import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//config parameter
//endpoint where I'm going to save the files
//file names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/toys`)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const uploader = multer({
    storage, onError: (err, next) => {
        console.log(err.message);
        next();
    }
})

export {
    __dirname,
    uploader
}