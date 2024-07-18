const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const app = express();

//Middlewares

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(morgan('dev'));

//Mounting the Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
