const express = require('express');
const AppErr = require('./utils/AppErr');
const morgan = require('morgan');

const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const globalErrorHandler = require('./controllers/ErrController');
const app = express();
app.use(express.static('./public'));

//Middlewares

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mounting the Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//handle udefined routes
app.all('*', (req, res, next) => {
  next(new AppErr(`Can't find ${req.originalUrl} on this server`, 404)); //skips all remaining non-error-handling middleware and passes the error to the next error-handling middleware
});

//___ Global Error Handling Middleware ___
app.use(globalErrorHandler);

module.exports = app;
