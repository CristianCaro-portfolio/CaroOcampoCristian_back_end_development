const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const readProducts = async () => {
    const productsJSON = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(productsJSON);
};

const writeProducts = async (products) => {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
};

router.get('/', async (req, res) => {
    try {
        const products = await readProducts();
        const limit = parseInt(req.query.limit);
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const products = await readProducts();
        const product = products.find(p => p.id === req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({error: 'Product not found'});
        }
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/', async (req, res) => {
    try {
        const {title, description, code, price, stock, category, thumbnails=[]} = req.body;
        
        // Validation
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({error: 'All fields are required except thumbnails'});
        }
        
        const products = await readProducts();
        const newProduct = {
            id: Date.now().toString(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        };
        
        products.push(newProduct);
        await writeProducts(products);
        
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const {title, description, code, price, status, stock, category, thumbnails} = req.body;

        // Validation
        if (!title || !description || !code || !price || status == null || !stock || !category) {
            return res.status(400).json({error: 'All fields are required'});
        }
        
        const products = await readProducts();
        const productIndex = products.findIndex(p => p.id === req.params.pid);
        
        if (productIndex === -1) {
            return res.status(404).json({error: 'Product not found'});
        }

        products[productIndex] = {...products[productIndex], title, description, code, price, status, stock, category, thumbnails};
        await writeProducts(products);

        res.json(products[productIndex]);
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const products = await readProducts();
        const newProducts = products.filter(p => p.id !== req.params.pid);
        
        if (products.length === newProducts.length) {
            return res.status(404).json({error: 'Product not found'});
        }
        
        await writeProducts(newProducts);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
