class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    // check if the code already exist in an existing product
    const codeExists = this.products.some((product) => product.code === code);
    if (codeExists) {
      throw new Error("The product code already exist");
    }

    // Generate a unique ID for the new product
    const id = this.generateUniqueId();

    // Create the new product
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    // Add product to arrangement
    this.products.push(newProduct);

    return newProduct;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  generateUniqueId() {
    //Generate an unique ID with the actual time in string
    return Date.now().toString();
  }
}

// Testing
const productManager = new ProductManager();

console.log(productManager.getProducts()); // []

const newProduct = productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

console.log(productManager.getProducts()); // [newProduct]

try {
  productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123", // Code duplicated
    stock: 25,
  });
} catch (error) {
  console.error(error.message); // It must shows an error
}

try {
  const nonExistentProduct = productManager.getProductById("nonexistentid");
  console.log(nonExistentProduct);
} catch (error) {
  console.error(error.message); // It must shows an error
}
