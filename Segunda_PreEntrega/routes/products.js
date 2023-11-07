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
        let { limit = 10, page = 1, sort, query } = req.query;

        // Converting to integer
        limit = parseInt(limit);
        page = parseInt(page);
        
        // This will be used for pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const products = await readProducts();

        // If query is defined, filter products
        if (query) {
            query = query.toLowerCase();
            products = products.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
        }
        
        // If sort is defined, sort products
        if (sort) {
            products.sort((a, b) => (sort === 'desc' ? b.price - a.price : a.price - b.price));
        }
        
        // Pagination
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Construct the result object
        const result = {
            status: 'success',
            payload: paginatedProducts,
            totalPages: Math.ceil(products.length / limit),
            prevPage: page - 1 > 0 ? page - 1 : null,
            nextPage: endIndex < products.length ? page + 1 : null,
            page,
            hasPrevPage: page - 1 > 0,
            hasNextPage: endIndex < products.length,
            prevLink: page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
            nextLink: endIndex < products.length ? `/api/products?page=${page + 1}&limit=${limit}` : null,
        };

        res.json(result);
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

app.get('/products', async (req, res) => {
    const products = await readProducts();
    res.render('products', { products: products });
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
