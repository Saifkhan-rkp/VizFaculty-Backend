const cors = require('cors');
// const mongoSanitize = require('express-mongo-sanitize');
// const xssClean = require('xss-clean');


const prodOrigins = process.env.PROD_ORIGINS || 'http://localhost:3000';
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const corsOptions = {
  origin:  [prodOrigins,'http://localhost:3000','https://viz-faculty-front-end.vercel.app'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Access-Control-Allow-Headers',
  ],
};

const securityMiddleware = (app) => {
  // removes any chars starting with dollar or dot
  // app.use(mongoSanitize());

  // xss protection
  // app.use(xssClean());

  // remove x-powered-by
  app.disable('x-powered-by');

  app.use(cors(corsOptions));
};

module.exports = securityMiddleware
