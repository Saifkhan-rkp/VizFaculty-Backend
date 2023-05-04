const { getFaculties } = require('../controllers');
const { createFaculty, getFaculty, modifyFaculty, deleteFaculty, getSingleDaySchedule } = require('../controllers');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/faculty/:fId", getFaculty)
    .get("/getFaculties", authM, getFaculties)
    .post("/faculty", authM, createFaculty)
    .put("/faculty/:fId", modifyFaculty)
    .delete("/faculty/:fId", deleteFaculty)
    .get("/faculty/schedule/:day", getSingleDaySchedule);
    
module.exports = router;