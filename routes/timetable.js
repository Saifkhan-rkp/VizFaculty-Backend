const { getTimetable, createTimetable, modifyTimetable, deleteTimeTable, getAllTimetables } = require('../controllers');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/tt/:ttId", getTimetable)
    .get("/timetables", authM, getAllTimetables)
    .post("/tt", createTimetable)
    .put("/tt/:ttId", modifyTimetable)
    .delete("/tt/:ttId", deleteTimeTable);
    
module.exports = router;