// const router = require('express').Router();

module.exports = (app)=>{
    app.use("/api", require('./auth'));
    app.use("/api", require('./organization'));
    app.use("/api", require('./timetable'));
    app.use("/api", require('./department'));
    app.use("/api", require('./faculties'));
    app.use("/api", require('./attendance'));
    app.use("/api", require('./contactUs'));
    app.use("/api", require('./salaryRequest.route'));
    app.use("/api", require('./transferSchedule.route'));
    app.use("/api", require('./utils.route'));
};