const catchAsync = require("../configs/catchAsync");
const { SalaryRequest } = require("../models");
const attendanceService = require("../services/attendance.service");


const createSalaryRequest = catchAsync(async (req, res, next) => {
    const { roleId } = req.user;
    const reqBody = req.body;
    reqBody.facultyId = roleId;
    await SalaryRequest.create(reqBody);
    res.send({ success: true, message: "Salary Request generated!" });
});

const getSalaryByDateRange = catchAsync(async (req, res) => {
    const { roleId } = req.user;
    const { fromDate, toDate } = req.body;
    const result = await attendanceService.aggregateSalaryByDateRange(roleId, fromDate, toDate);
    res.send({ success: true, totalSalary: result?.totalSalary || 0 });
});

const getLatestSalaryRequest = catchAsync(async (req, res) => {
    const { roleId } = req.user;
    const result = await SalaryRequest.findOne({ facultyId: roleId }).sort({_id:-1}).exec();
    console.log(result);
    res.send({success:Object.keys(result||{}).length>0, salaryRequest:result});
});

module.exports = {
    createSalaryRequest,
    getSalaryByDateRange,
    getLatestSalaryRequest
}