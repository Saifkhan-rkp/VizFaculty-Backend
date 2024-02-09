const { getAttendance, submitAttendance } = require('../controllers');
const { todaysAttendance } = require('../controllers/attendance.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/attendance/:date", authM, getAttendance)
    .get("/attendance/todays/:date", authM, todaysAttendance)
    .post("/attendance", submitAttendance);
    
module.exports = router;