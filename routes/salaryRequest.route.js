

const { createSalaryRequest, getSalaryByDateRange, getLatestSalaryRequest } = require('../controllers/salaryRequest.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router.post("/salary-request/generate", authM, createSalaryRequest);

router.post("/salary-request/salaryByDateRange", authM, getSalaryByDateRange)

router.get("/salary-request/latest", authM, getLatestSalaryRequest);

module.exports = router;