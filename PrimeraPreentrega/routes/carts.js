const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

const readCarts = async () => {
    const cartsJSON = await fs.readFile(cartsFilePath, 'utf-8');
    return JSON.parse(cartsJSON);
};

const writeCarts = async (carts) => {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
};

router.get('/:cid', async (req, res) => {
    try {
        const carts = await readCarts();
        const cart = carts.find(c => c.id === req.params.cid);

        if (!cart) {
            return res.status(404).json({error: 'Cart not found'});
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/', async (req, res) => {
    try {
        const carts = await readCarts();
        const newCart = {
            id: Date.now().toString(),
            products: []
        };

        carts.push(newCart);
        await writeCarts(carts);

        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = await readCarts();
        const cart = carts.find(c => c.id === req.params.cid);

        if (!cart) {
            return res.status(404).json({error: 'Cart not found'});
        }

        const product = cart.products.find(p => p.product === req.params.pid);

        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({product: req.params.pid, quantity: 1});
        }

        await writeCarts(carts);

        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
