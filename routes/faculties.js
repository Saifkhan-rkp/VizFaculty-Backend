const { getFaculties } = require('../controllers');
const { createFaculty, getFaculty, modifyFaculty, deleteFaculty, getSingleDaySchedule } = require('../controllers');
const { getFacultyHeaderStatus, getFacultyForSettings } = require('../controllers/faculty.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/faculty/:fId", getFaculty)
    .get("/faculty/v1/for-settings", authM, getFacultyForSettings)
    .get("/faculty/v1/headerstats", authM, getFacultyHeaderStatus) // /faculty/v1/headerstats?month=
    .get("/getFaculties", authM, getFaculties)
    .post("/faculty", authM, createFaculty)
    .put("/faculty/:fId", modifyFaculty)
    .delete("/faculty/:fId", deleteFaculty)
    .get("/faculty/schedule/:day", authM, getSingleDaySchedule);

module.exports = router;