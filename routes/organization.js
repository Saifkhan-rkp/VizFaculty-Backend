const { getOrgById, createOrg } = require('../controllers');
const { getOrgForSettings } = require('../controllers/org.controller');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/org/:orgId", getOrgById)
    .post("/org-create", createOrg)
    .get("/org/v1/for-settings", authM, getOrgForSettings);
    
module.exports = router;