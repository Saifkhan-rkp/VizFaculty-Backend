const catchAsync = require("../configs/catchAsync");
const { SalaryRequest } = require("../models");


const createSalaryRequest = catchAsync(async (req, res, next)=>{
    const { roleId } = req.user;
    const reqBody = req.body;
    await SalaryRequest.create(reqBody);
    res.send({success:true, message:"Salary Request generated!"});
});

module.exports ={
    createSalaryRequest
}