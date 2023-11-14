import { Router } from 'express';
import cartsModel from '../models/carts.js';
import cartsModel from '../models/products.js';

const router = Router();

router.get('/carts', async (req, res) => {
    const { page = 1 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await cartsModel.paginate({}, { limit: 5, page, lean: true });

    res.render('carts', {
        carts: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    });
});

router.get('/products', async (req, res) => {
    const { page = 1 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate({}, { limit: 5, page, lean: true });

    res.render('products', {
        products: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    });
});

export default router;