import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import formidableMiddleware from 'express-formidable';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import pkg from '../../package.json';
import winstonLogger from './winston';
import * as environments from './environments';
import APIError from '../errors/APIError';
import routes from './routes';
import { admin, adminRouter } from './adminBro';

const app = express();

// Uncomment next block and comment the line after to log only on dev environment
// if(environments.nodeEnv==='development'){
//   app.use(morgan('dev'));
// }

app.use(morgan('dev'));

winstonLogger.stream = {
  write: (message) => {
    winstonLogger.info(message);
  },
};

if (environments.nodeEnv !== 'test') {
  app.use(morgan('combined', { stream: winstonLogger.stream }));
}

app.use(
  admin.options.rootPath,
  cookieParser(),
  session({
    secret: pkg.name,
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: environments.mongoUrl,
      collection: 'sessions',
      touchAfter: 24 * 3600,
      autoRemove: 'native',
      useUnifiedTopology: true,
    }),
  }),
  formidableMiddleware()
);

app.use(admin.options.rootPath, adminRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());

// Secure middlewares
app.use(helmet());
app.use(cors());

app.use('/api', routes);

// 404 - endpoint not found
app.use((req, res, next) => {
  const notFoundError = new APIError(
    'Endpoint not found',
    httpStatus.NOT_FOUND,
    true
  );
  return next(notFoundError);
});

// Catch errors passed from controllers
app.use((err, req, res, next) => {
  // Change error catched to APIError if instance is not APIError
  if (!(err instanceof APIError)) {
    const newError = new APIError(
      err.message || 'An unknown error occured',
      httpStatus.INTERNAL_SERVER_ERROR
    );

    return next(newError);
  }

  return next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.status === httpStatus.INTERNAL_SERVER_ERROR) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  res.status(err.status).send({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: environments.nodeEnv === 'development' ? err.stack : null,
  });
});

export default app;
