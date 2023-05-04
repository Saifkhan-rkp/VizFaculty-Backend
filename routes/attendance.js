const { getAttendance, submitAttendance } = require('../controllers');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/attendance/:date", authM, getAttendance)
    .post("/attendance", submitAttendance);
    
module.exports = router;