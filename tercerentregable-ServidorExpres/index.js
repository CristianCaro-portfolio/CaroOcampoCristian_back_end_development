import express from 'express';
import { ProductManager } from './src/ProductManager'; //The file we're importing does not export a default value with the 'default' keyword. Instead, it appears to be using named exports.

const app = express();

//create instance ProductManager class.
const productManager = new ProductManager('./src/Products.json');


//It configures Express to parse URL-encoded data in incoming requests.
app.use(express.urlencoded({extended: true}));

// Route for /products type GET. It calls the getAll method from the ProductManager class using the class instance.
app.get('/products', async (req, res) => {
  const products = await productManager.getAll();
  res.send(products);
});

// Route /products/:pid type GET where we should call the getById method of the ProductManager class using the created class instance.
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid); // Get the pid parameter from the URL and parse it to an integer.

  try {
      const product = await productManager.getById(productId);
      if (product) {
          res.send(product);
      } else {
          res.status(404).send('Product not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching the product');
  }
});

// Example of async/await calling the ProductManager class.
app.get('/', async (req, res) => {
  const products = await productManager.getAll();
  res.send({ products });
});

app.listen(8080, () => console.log("Listening on 8080"));