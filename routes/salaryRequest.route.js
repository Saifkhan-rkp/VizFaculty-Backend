

const { createSalaryRequest } = require('../controllers/salaryRequest.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router.post("/salary-request/generate", authM, createSalaryRequest);

module.exports = router;