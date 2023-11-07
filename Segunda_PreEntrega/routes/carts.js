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

app.get('/carts/:cid', async (req, res) => {
    const carts = await readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).send('Cart not found');
    }

    const populateCartProducts = async (cart) => {
        const products = await readProducts();
    
        cart.products = cart.products.map(product => ({
        ...product,
        details: products.find(p => p.id === product.product)
        }));
    
        return cart;

        res.render('cart', { cart: cart });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const carts = await readCarts();
        const cart = carts.find(c => c.id === req.params.cid);
        const populatedCart = await populateCartProducts(cart);
        res.json(populatedCart);

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

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const carts = await readCarts();
        const cart = carts.find(c => c.id === req.params.cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const newProducts = cart.products.filter(p => p.product !== req.params.pid);

        if (cart.products.length === newProducts.length) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        cart.products = newProducts;
        await writeCarts(carts);

        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body; // Expecting an array of products
        const carts = await readCarts();
        const cartIndex = carts.findIndex(c => c.id === req.params.cid);

        if (cartIndex === -1) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Replace products array
        carts[cartIndex].products = products;
        await writeCarts(carts);

        res.json({ status: 'success', cart: carts[cartIndex] });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body; // Expecting a quantity
        const carts = await readCarts();
        const cart = carts.find(c => c.id === req.params.cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const product = cart.products.find(p => p.product === req.params.pid);

        if (!product) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Update quantity
        product.quantity = quantity;
        await writeCarts(carts);

        res.json({ status: 'success', cart });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const carts = await readCarts();
        const cartIndex = carts.findIndex(c => c.id === req.params.cid);

        if (cartIndex === -1) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Remove all products
        carts[cartIndex].products = [];
        await writeCarts(carts);

        res.json({ status: 'success', message: 'All products removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
