const { default: mongoose } = require("mongoose");
const { Organization, User, Faculty, Department, SalaryRequest } = require("../models");
const { addUser, rolesAndRef } = require("../configs/helpers");
const catchAsync = require("../configs/catchAsync");
const salaryRequestService = require("../services/salaryRequest.service");
const { Constants } = require("../configs/constants");

async function addOrg(details) {
    console.log("here 4");
    try {
        const org = new Organization(details);
        console.log("here 5");
        // let ret;
        await org.save();
        const modifyRole = await User.updateOne({ _id: details.auth }, { role: rolesAndRef.adminDept.role, model_type: rolesAndRef.adminDept.ref, roleId: org._id });
        return { success: true, org, isRoleUpdated: modifyRole.modifiedCount > 0 };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message }
    }
}

const createOrg = async (req, res, next) => {
    try {
        console.log("here..");
        const { name, code, email } = req.body;
        const userAlive = await User.findOne({ email });
        console.log("here 2");
        if (userAlive) {
            console.log("here 3");
            const result = await addOrg({
                name,
                code,
                auth: new mongoose.Types.ObjectId(userAlive._id)
            });
            if (result.success) {
                res.status(201).send({ success: true, message: "Organization/Institution Registered Successfully!", ...result });
            } else if (!result.success) {
                result.statusCode = 500;
                next(result);
            }
        } else {
            addUser({ intro: "You are invited for role Adminstration Departmet Head, please complete registration process.", email, })
                .then(async user => {
                    const result = await addOrg({
                        name,
                        code,
                        auth: user.id
                    });
                    if (result.success) {
                        res.status(201).send({ success: true, message: "Organization/Institution Registered Successfully!", ...result });
                    } else if (!result.success) {
                        result.statusCode = 500;
                        next(result);
                    }

                }).catch(err => next(err))
        }
        // org.save((err, result) => {
        //     if (err) {
        //         err.statusCode = 401
        //         return next(err)
        //     }
        //     res.staus(201).send({ success: true, message: "Organization/Institution Registered Successfully!", ...result })
        // });
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const getOrgById = async (req, res, next) => {
    const { orgId } = req.params;
    try {
        if (!mongoose.isValidObjectId(orgId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const orgDoc = await Organization.findOne({ _id: new mongoose.Types.ObjectId(orgId) }, { _id: 0, });
        if (!orgDoc)
            return next({ message: "Not Found", statusCode: 404 });
        res.send(orgDoc);
    } catch (error) {
        console.log(error);
        error.statusCode = 500;
        next(error)
    }
};

const getOrgForSettings = catchAsync(async (req, res) => {
    const { roleId } = req.user;
    const result = await Organization.findOne({ _id: roleId })
    res.send({ success: true, org: result });
});

const getOrgHeaderStatus = catchAsync(async (req, res, next) => {
    const { role, roleId } = req.user;
    // const { month } = req.query;
    const facultyCount = await Faculty.find({ inOrganization: roleId }).count();
    const deptCount = await Department.find({ orgId: roleId }).count();
    const salaryRequestCount = await SalaryRequest.find({ "forwardToAdminDept.fwdId": roleId, "forwardToAdminDept.status": "pending" }).count();
    const expenditure = await salaryRequestService.expenditureAggregation(role === Constants.ROLES.hod ? "forwardToHead" : "forwardToAdminDept", roleId);

    res.send({
        facultyCount,
        deptCount,
        salaryRequestCount,
        expenditure: expenditure?.expenditure || 0,
    })
});

module.exports = { createOrg, getOrgById, getOrgForSettings, getOrgHeaderStatus }