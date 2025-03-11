const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDB = require('./db/index');
const userRoutes = require('./routes/users.routes');
const gameRoutes = require('./routes/game.routes');
const morgan = require('morgan')
const redis = require('./redisClient')

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});


app.use('/users', userRoutes);
app.use('/games', gameRoutes);


module.exports = app;
