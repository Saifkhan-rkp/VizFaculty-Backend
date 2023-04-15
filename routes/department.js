const { getDept, createDept, modifyDept, deleteDept } = require('../controllers');

const router = require('express').Router();

router
    .get("/dept/:deptId", getDept)
    .post("/dept", createDept)
    .put("/dept/:deptId", modifyDept)
    .delete("/dept/:deptId", deleteDept);

module.exports = router;