const { createContactUs } = require('../controllers');

const router = require('express').Router();

router
    .post("/contactUs", createContactUs);

module.exports = router;