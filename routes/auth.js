
const { register, login, verify, forgotPassword, resetPassword } = require('../controllers');

const router = require('express').Router();

router
    .get("/verify", verify)
    .post("/auth/register",register)
    .post("/auth/login",login)
    .post("/forget-password", forgotPassword)
    .post("/reset-password/:token", resetPassword);

module.exports = router;