const { getDept, createDept, modifyDept } = require('../controllers');

const router = require('express').Router();

router
    .get("/dept/:deptId", getDept)
    .post("/dept", createDept)
    .put("/dept/:deptId", modifyDept);

module.exports = router;