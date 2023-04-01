const morgan = require('morgan');
const logger = require('.././configs/logger');

module.exports = {
    loggerMiddleware : (app)=>{
        // morgan.token('user-type', function (req, res) { return req.headers['user-type'] })
        // app.use(morgan(':method :url :status :user-type'));git rm -r --cached folder_name 
        app.use(morgan("common",{stream: logger.stream }));
    },
    auth: require('./authMiddleware'),
    securityMiddleware:require('./securityMiddleware')
};