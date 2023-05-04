const { getTimetable, createTimetable, modifyTimetable, deleteTimeTable } = require('../controllers');

const router = require('express').Router();

router
    .get("/tt/:ttId", getTimetable)
    .post("/tt", createTimetable)
    .put("/tt/:ttId", modifyTimetable)
    .delete("/tt/:ttId", deleteTimeTable);
    
module.exports = router;