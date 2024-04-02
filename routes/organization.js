const { getOrgById, createOrg } = require('../controllers');
const { getOrgForSettings, getOrgHeaderStatus, getDeptByExpence } = require('../controllers/org.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/org/:orgId", getOrgById)
    .get("/org/v1/dept-expence-wise", authM, getDeptByExpence)
    .post("/org-create", createOrg)
    .get("/org/v1/headerstats", authM, getOrgHeaderStatus)
    .get("/org/v1/for-settings", authM, getOrgForSettings);
    
module.exports = router;