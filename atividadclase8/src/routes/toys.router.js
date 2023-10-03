import { Router } from 'express';
import { uploader } from '../../utils.js';

const router = Router();
const toys = [];

//Middleware at router level
router.use((req, res, next) => {
    console.log('Time Router: ', Date.now());
    next();
});

//Obtain toys list
router.get('/', (req, res) => {
    res.send({ status: 'success', payload: toys });
});

router.post('/', (req, res) => {
    // {
    //     name: 'HeroMan car',
    //     type: 'car'
    // }
    const toy = req.body; //obtaining object that we are going to insert
    if(!toy.name) {
        return res.status(400).send({ status: 'error', error: 'incomplete values' });
    }
    toys.push(toy);
    res.send({ status: 'success', payload: toy });
});

router.post('/v2', uploader.single('thumbnail'), (req, res) => {
    //We must validate that the user send a file with the toy
    const filename = req.file.filename;
    if(!filename) return res.status(500).send({ status: 'error', error: 'failed upload file' });
    // {
    //     name: 'HeroMan Car',
    //     type: 'car'
    // }
    const toy = req.body; //obtaining object we are going to insert
    if(!toy.name) {
        return res.status(400).send({ status: 'error', error: 'incomplete values' });
    }
    toy.thumbnail = `http://localhost:8080/img/toys/${filename}`;
    toys.push(toy);
    res.send({ status: 'success', payload: toy });
});

export default router;