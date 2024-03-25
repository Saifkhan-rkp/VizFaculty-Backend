
const { register, login, verify, forgotPassword, resetPassword, completeRegister, getUser } = require('../controllers');
const { changePassword } = require('../controllers/auth/auth');
const { authM } = require('../middleware');

const router = require('express').Router();

router
    .get("/verify", verify)
    .get("/auth/user/self", authM, getUser)
    .post("/auth/register", register)
    .post("/auth/change-password", authM, changePassword)
    .post("/auth/login", login)
    .post("/forget-password", forgotPassword)
    .post("/reset-password/:token", resetPassword)
    .post("/auth/completeRegister/:token", completeRegister);

module.exports = router;