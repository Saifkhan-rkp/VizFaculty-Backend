const catchAsync = require("../configs/catchAsync");
const { Constants } = require("../configs/constants");
const { SalaryRequest, Faculty } = require("../models");
const attendanceService = require("../services/attendance.service");
const salaryRequestService = require("../services/salaryRequest.service");


const createSalaryRequest = catchAsync(async (req, res, next) => {
    const { roleId } = req.user;
    const reqBody = req.body;
    const faculty = await Faculty.findOne({ _id: roleId }, { _id: 1, inDepartment: 1, inOrganization: 1, faculty: 1 });
    reqBody.facultyId = faculty._id;
    reqBody.userId = faculty.faculty;
    reqBody.forwardToHead = { fwdId: faculty.inDepartment, isForwarded: true, date: reqBody?.applyDate || new Date() };
    reqBody.forwardToAdminDept = { fwdId: faculty.inOrganization };
    // console.log(reqBody);
    await SalaryRequest.create(reqBody);
    res.send({ success: true, message: "Salary Request generated!" });
});

const getSalaryByDateRange = catchAsync(async (req, res) => {
    const { roleId } = req.user;
    const { dateFrom, dateTo } = req.body;
    const result = await attendanceService.aggregateSalaryByDateRange(roleId, dateFrom, dateTo);
    // console.log(result)
    res.send({ success: true, totalSalary: result?.totalSalary || 0 });
});

const getLatestSalaryRequest = catchAsync(async (req, res) => {
    const { roleId } = req.user;
    const result = await SalaryRequest.findOne({ facultyId: roleId }).sort({ _id: -1 }).exec();
    // console.log(result);
    res.send({ success: Object.keys(result || {}).length > 0, salaryRequest: result });
});


const getFrowordedApplications = catchAsync(async (req, res) => {
    const { roleId, role } = req.user;
    if (![Constants.ROLES.adminDept, Constants.ROLES.hod].includes(role)) {
        res.status(401).send({ success: false, message: "Unauthorized to access Salary Requests" })
    }
    const result = await salaryRequestService.getRequestsByForwordStatus(role === Constants.ROLES.hod ? "forwardToHead" : "forwardToAdminDept", roleId);
    res.send({ success: true, requests: result || [] });
});

module.exports = {
    createSalaryRequest,
    getSalaryByDateRange,
    getLatestSalaryRequest,
    getFrowordedApplications,
}