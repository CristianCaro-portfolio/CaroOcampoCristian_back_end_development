import express from 'express';
import usersRouter from './src/routes/users.router.js';
import usersRouter from './src/routes/toys.router.js';
import { __dirname } from './utils.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Middleware at application level
app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

//Middleware at route or path or service level
function middlewareNivelServicio(req, res, next) {
  req.dato1 = 'agregado a nivel del middleware'
  next();
}

//ad config to serve static files
console.log(__dirname);
//virtual Prefix -> define a path to access to our files
// app.use(express.static(`${__dirname}/public`));
//Middleware incorporated from express
app.use('/static-files', express.static(`${__dirname}/public`));

app.use('/api/users', usersRouter);
app.use('/api/toys', toysRouter);

app.get('/test', middlewareNivelServicio, (req, res) => {
  console.log(variableNoExiste);
  res.send({ payload: {
      dato: req.dato1
  } })
});

//Middleware managing errors, ever at the final
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send({ error: err.message });
});

app.listen(8080, () => console.log('Server running'));