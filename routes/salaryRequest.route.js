

const { createSalaryRequest, getSalaryByDateRange, getLatestSalaryRequest, getFrowordedApplications, changApplicationStatus } = require('../controllers/salaryRequest.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router.post("/salary-request/generate", authM, createSalaryRequest);

router.post("/salary-request/updateStatus", authM, changApplicationStatus);

router.post("/salary-request/salaryByDateRange", authM, getSalaryByDateRange)

router.get("/salary-request/latest", authM, getLatestSalaryRequest);

router.get("/salary-request/getForwarded", authM, getFrowordedApplications)

module.exports = router;