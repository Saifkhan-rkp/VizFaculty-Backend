const { default: mongoose } = require("mongoose");
const { User, Department, Organization, Faculty, Timetable, SalaryRequest } = require("../models");
const { addUser, rolesAndRef } = require("../configs/helpers");


const addDept = async (deptData) => {
    try {
        const dept = new Department(deptData);
        console.log("here 5");
        // let ret;
        await dept.save();
        const modifyOrg = await Organization.updateOne({ _id: dept.orgId },
            {
                $push: {
                    departments: {
                        $each: [{
                            deptName: dept.deptName,
                            deptId: dept._id
                        }],
                        $slice: -10
                    }
                }
            })
        const modifyRole = await User.updateOne({ _id: deptData.deptHeadId }, {
            $set: {
                role: rolesAndRef.deptHead.role,
                model_type: rolesAndRef.deptHead.ref,
                roleId: dept._id
            }
        });
        return { success: true, dept, isRoleUpdated: modifyRole.modifiedCount > 0, isOrgUpdated: modifyOrg.modifiedCount > 0 }; //isOrgUpdated: modifyOrg.modifiedCount>0
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message }
    }
};

const createDept = async (req, res, next) => {
    try {
        console.log("here..");
        const { deptName, code, email, headName } = req.body;
        const { roleId } = req.user;
        const userAlive = await User.findOne({ email });
        const userDetail = {}
        console.log("here 2");
        if (userAlive) {
            console.log("here 3");
            userDetail.id = userAlive.id;
        } else {
            await addUser({ intro: `You are invited for role Head of ${deptName}, please complete registration process.`, email, token: "something" })
                .then(user => {
                    userDetail.id = user.id;
                }).catch(err => next(err))
        }
        console.log("userdetail------->", userDetail);
        const result = await addDept({
            deptName,
            code,
            deptHeadId: userDetail.id,
            orgId: roleId
        });
        if (result.success) {
            res.status(201).send({ success: true, message: "Deparment Added to your Organization/ Instatution Successfully!", ...result });
        } else if (!result.success) {
            result.statusCode = 500;
            next(result);
        }
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const getDept = async (req, res, next) => {
    try {
        const { deptId } = req.params;
        // console.log("this is runnig default",req?.user);
        // const { roleId } = req.user;
        if (!mongoose.isValidObjectId(deptId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const dept = await Department.findById(deptId, { _id: 0 }).populate([
            {
                path: "deptHeadId",
                select: "name email role profilePhoto"
            }, {
                path: "orgId",
                select: "name code"
            }]);
        if (!dept)
            return next({ message: "Not Found/ Not Exists", statusCode: 404 });
        res.status(201).send({ success: true, message: "found", ...dept._doc });
    } catch (error) {
        next.statusCode = 500;
        next(error);
    }
};

const modifyDept = async (req, res, next) => {
    try {
        const { deptId } = req.params;
        const toModify = req.body;
        if (!mongoose.isValidObjectId(deptId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const isDeptModified = await Department.updateOne({ _id: deptId }, { $set: toModify, $currentDate: { updatedAt: true } });
        if (isDeptModified.modifiedCount > 0)
            return res.status(201).send({ success: true, message: "Department Updated Successfully!" });
        res.send({ success: false, message: "Unable to update Department" });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

const deleteDept = async (req, res, next) => {
    try {
        const { deptId } = req.params;
        const { roleId } = req.user;
        // const roleId = "64384ff5def198fea620e35a";
        if (!mongoose.isValidObjectId(deptId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const deletedDept = await Department.deleteOne({ _id: deptId });
        const userWithRole = await User.updateOne({ roleId: deptId }, {
            $set: { role: "normal" },
            $unset: { model_type: 1, roleId: 1 },
            $currentDate: { updatedAt: true }
        })
        const removeDeptFromOrg = await Organization.updateOne({ _id: roleId },
            {
                $pull: {
                    departments: {
                        deptId
                    }
                }
            })
        if (deletedDept.deletedCount > 0)
            return res.status(201).send({ success: true, message: "Department Deleted Successfully", isUserModified: userWithRole.modifiedCount > 0, isOrgUpdated: removeDeptFromOrg.modifiedCount > 0 });
        next({ statusCode: 400, message: "Unable to delete department/may it does'nt exists" });
    } catch (error) {
        error.statusCode = 500
        next(error)
    }
}

const getDepartments = async (req, res, next) => {
    try {
        const { roleId } = req.user;
        console.log(roleId,);
        const depts = await Department.find({ orgId: roleId }).populate("deptHeadId", "name email profilePhoto").exec();
        // console.log(depts);
        res.send({ success: true, depts })
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

const getDeptHeaderStats = async (req, res, next) => {
    try {
        const { roleId } = req.user;
        console.log(roleId, "executing");
        const facultyCount = await Faculty.find({ inDepartment: roleId }).count();
        const timetableCount = await Timetable.find({ deptId: roleId }).count();
        const salaryRequestCount = await SalaryRequest.find({ "forwardToHead.fwdId": roleId, "forwardToHead.status": "pending" }).count();
        res.send({ facultyCount, timetableCount, salaryRequestCount });
    } catch (error) {
        console.log(error);
        next({ statusCode: 500, message: error.message })
    }
}

module.exports = { createDept, getDept, modifyDept, deleteDept, getDepartments, getDeptHeaderStats };