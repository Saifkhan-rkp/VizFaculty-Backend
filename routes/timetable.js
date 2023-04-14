const { getTimetable, createTimetable, modifyTimetable } = require('../controllers');

const router = require('express').Router();

router
    .get("/tt/:ttId", getTimetable)
    .post("/tt", createTimetable)
    .put("/tt/:ttId", modifyTimetable)
    
module.exports = router;