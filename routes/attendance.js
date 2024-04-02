const { getAttendance, submitAttendance } = require('../controllers');
const { todaysAttendance, getAttendanceByMonth, submitNFCAttendance, attendanceByDateRange } = require('../controllers/attendance.controller');
const { authM } = require('../middleware');
const verifyNFC = require('../middleware/verifyNFC');

const router = require('express').Router();

router.get("/attendance/:date", authM, getAttendance);

router.get("/attendance/todays/:date", authM, todaysAttendance);

router.post("/attendance", authM, submitAttendance);

router.post("/attendance/view/byDateRange", authM, attendanceByDateRange);

router.get("/attendance/by-month/:month", authM, getAttendanceByMonth);

router.get("/attendance/nfc/:roleId/:date", verifyNFC, submitNFCAttendance);

router.get("/attendance/no-auth-nfc/:roleId/:date", submitNFCAttendance);

module.exports = router;