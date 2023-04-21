const { getDept, createDept, modifyDept, deleteDept, getDepartments } = require('../controllers');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/dept/:deptId", getDept)
    .get("/getDepartments", authM, getDepartments)
    .post("/dept", createDept)
    .put("/dept/:deptId", modifyDept)
    .delete("/dept/:deptId", deleteDept);

module.exports = router;