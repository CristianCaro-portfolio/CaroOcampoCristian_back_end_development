const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const { engine } = require('express-handlebars');

const app = express();

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');