const { createFaculty, getFaculty, modifyFaculty, deleteFaculty, getSingleSchedule } = require('../controllers');

const router = require('express').Router();

router
    .get("/faculty/:fId", getFaculty)
    .post("/faculty", createFaculty)
    .put("/faculty/:fId", modifyFaculty)
    .delete("/faculty/:fId", deleteFaculty)
    .get("/faculty/schedule/:day", getSingleSchedule);
    
module.exports = router;