// const router = require('express').Router();

module.exports = (app)=>{
    app.use("/api", require('./auth'));
    app.use("/api", require('./organization'));
    app.use("/api", require('./timetable'));
    app.use("/api", require('./department'));
    app.use("/api", require('./faculties'));
};