const { getAttendance, submitAttendance } = require('../controllers');
const { todaysAttendance, getAttendanceByMonth } = require('../controllers/attendance.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router.get("/attendance/:date", authM, getAttendance);

router.get("/attendance/todays/:date", authM, todaysAttendance);

router.post("/attendance", authM, submitAttendance);

router.get("/attendance/by-month/:month", authM, getAttendanceByMonth);

module.exports = router;