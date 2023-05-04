const { createFaculty, getFaculty, modifyFaculty, deleteFaculty, getSingleDaySchedule } = require('../controllers');

const router = require('express').Router();

router
    .get("/faculty/:fId", getFaculty)
    .post("/faculty", createFaculty)
    .put("/faculty/:fId", modifyFaculty)
    .delete("/faculty/:fId", deleteFaculty)
    .get("/faculty/schedule/:day", getSingleDaySchedule);
    
module.exports = router;