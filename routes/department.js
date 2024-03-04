const { getDept, createDept, modifyDept, deleteDept, getDepartments } = require('../controllers');
const { authM } = require('../middleware');

const router = require('express').Router();

router.get("/dept/:deptId", getDept)

router.get("/dept/getData", authM, getDept);

router.get("/getDepartments", authM, getDepartments);

router.post("/dept", authM, createDept);

router.put("/dept/:deptId", modifyDept);

router.delete("/dept/:deptId", deleteDept);

module.exports = router;