const express = require('express');
var morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//secure http headers
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Request!! Try again',
});

//security middleware
app.use('/api', limiter);

//body parser
app.use(express.json({ limit: '10kb' }));

//data sanitization against mogo query injection
app.use(mongoSanitize());

//data senitization against xss
app.use(xss());

//polluting parameters middleware
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantiy',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  })
);

//serving static files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
