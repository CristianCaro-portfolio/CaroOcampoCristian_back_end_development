const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const exphbs  = require('express-handlebars');

const app = express();
const server = http.createServer(app);
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const io = new Server(server);


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

app.get('/', async (req, res) => {
  const products = await readProducts(); 
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await readProducts();
  res.render('realTimeProducts', { products });
});