
const { ProductManager } = require("./managers/ProductManager");

const manager = new ProductManager('./files/Products.json');

const env = async () => {
  const products = await manager.getProducts();
  console.log(products);

  const product = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  };

  await manager.createProduct(product);

    const productsFinalResult = await manager.getProducts();
    console.log(productsFinalResult);
}