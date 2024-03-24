const { transeferSchedules } = require("../controllers/transferSchedule.controller");
const { authM } = require("../middleware");

const router = require("express").Router();


router.post("/transfer-schedule/multiple", authM, transeferSchedules)

module.exports = router