const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //obtain products from Products.json
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                //if exist we read the contain
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    createProduct = async (product) => {
        try {
            //obtain all products saved
            //object array
            const products = await this.getProducts();

            if (products.length === 0) {
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }

            //insert the product
            products.push(product);

            //once finished the process
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return product;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    ProductManager
}