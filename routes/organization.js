const { getOrgById, createOrg } = require('../controllers');

const router = require('express').Router();

router
    .get("/org/:orgId", getOrgById)
    .post("/org-create", createOrg)
    
module.exports = router;