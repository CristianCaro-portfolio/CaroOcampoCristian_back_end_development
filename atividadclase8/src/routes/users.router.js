import { Router } from 'express';

const router = Router();
const users = [];

router.get('/', (req, res) => {
    res.send({ status: 'success', payload: users });
});

router.post('/', (req, res) => {
    const user = req.body; //Obtaining object we are going to insert
    if(!user.name) {
        return res.status(400).send({ status: 'error', error: 'incomplete values' });
    }
    users.push(user);
    res.send({ status: 'success', payload: user });
});

export default router;