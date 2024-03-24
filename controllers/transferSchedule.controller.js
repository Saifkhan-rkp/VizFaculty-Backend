const catchAsync = require("../configs/catchAsync");
const TransferScheduleModel = require("../models/TransferSchedule.model");


const transeferSchedules = catchAsync(async (req, res) => {
    const { roleId } = req.user;
    if(!roleId) return res.status(401).send({message:"Unauthorized transfer schedule"})
    const { transferSchedule } = req.body;
    // console.log(transferSchedule);
    const multipleTransfer = await TransferScheduleModel.insertMany(transferSchedule);
    // console.log(multipleTransfer);
    res.send({ success: multipleTransfer.length > 0 })
})

module.exports = { transeferSchedules }