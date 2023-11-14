import express from 'express';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import __dirname from './utils.js';

const app = express();

try {
    await mongoose.connect('mongodb+srv://cristiancaro465792:HHXI4o0vfdfg65gdf@cluster465792ap.f6sdfgy.mongodb.net/preentrega2?retryWrites=true&w=majority');
    console.log('DB connected');
} catch (error) {
    console.log(error.message);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600
    }),
    secret: 'student1684321dummi',
    resave: true, //nos sirve para poder refrescar o actualizar la sesión luego de un de inactivadad
    saveUninitialized: true, //nos sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
    // cookie: {
    //     maxAge: 30000
    // }
}));

app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

app.listen(8080, () => console.log('Server running'));