const express = require('express');
const createError = require('http-errors');
const routes = require('./routes');
const securityMiddleware = require('./middleware/securityMiddleware');
const infologger = require('./configs/logger');
const { loggerMiddleware } = require('./middleware');

const app = express();

process.on('unhandledRejection',(reason)=>{
    infologger.error(reason);
    process.exit(1);
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
loggerMiddleware(app);
securityMiddleware(app);

//routes for api
routes(app);


app.use((req,res,next)=>{
    const error = createError(404);
    next(error);
});

app.use((error,req,res,next)=>{
    infologger.error(error.message);
    console.log(error);
    res.statusCode = error.statusCode;
    res.send({
        success:false,
        message : error.message
    });
});


module.exports = app;