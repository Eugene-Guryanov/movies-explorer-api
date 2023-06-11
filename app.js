require('dotenv').config();

const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { loginValidation, userValidation } = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const limiter = require('./middlewares/rateLimiter');
const { centralizedErrorHandler } = require('./middlewares/centralizedErrorHandler');

const app = express();
const allowedCors = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://ges.nomoredomains.rocks',
  'http://ges.nomoredomains.rocks',
  'http://localhost:3001/api',
  'http://localhost:3000/api',
  'https://ges.nomoredomains.rocks/api',
  'http://ges.nomoredomains.rocks/api',
];
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }
  next();
});
const { PORT = 3000, mongoAddress = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(limiter);
app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);
app.use('/', auth, userRouter);
app.use('/', auth, movieRouter);

app.use('*', auth, () => {
  throw new NotFoundError('По указаному url ничего нет');
});

app.use(errorLogger);

app.use(errors());

app.use(centralizedErrorHandler);

mongoose.connect(mongoAddress);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
