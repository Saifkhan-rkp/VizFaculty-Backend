const catchAsync = require("../configs/catchAsync");
const jwt = require('jsonwebtoken');
const { Constants } = require("../configs/constants");
const { authM } = require("../middleware");
const { User, Department, Organization } = require("../models");
const facultyService = require("../services/faculty.service");

const router = require("express").Router();


router.post("/v1/settings/update", authM, catchAsync(async (req, res) => {
    const { role, userId, roleId } = req.user;
    const { name } = req.body;
    let userUpdate = { modifiedCount: 0 }
    let newAuth = {}
    if (name) {
        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { name } }, { new: false }).select("_id roleId role name email profilePhoto");
        // console.log(user)
        // console.log("user--> ", user.name === name)
        if (user.name !== name) {
            const accessToken = jwt.sign(
                { userId: user._id, role: user.role, roleId: user?.roleId },
                process.env.ADD_USER_SECRET || "VizFaculty is Calculating",
                {
                    expiresIn: "7d",
                }
            );
            newAuth = { accessToken, ...user._doc, name: name }
        }
    }
    let update = { modifiedCount: 0 }
    if (role === Constants.ROLES.faculty) {
        const { abbrivation } = req.body;
        if (abbrivation)
            update = await facultyService.updateFaculty(roleId, { abbrivation });
    } else if (role === Constants.ROLES.hod) {
        const { deptName, code } = req.body;
        if (deptName && code) {
            update = await Department.updateOne({ _id: roleId }, { $set: { deptName, code } })
        }
    } else if (role === Constants.ROLES.adminDept) {
        const { orgName, code } = req.body;
        if (orgName && code) {
            update = await Organization.updateOne({ _id: roleId }, { $set: { orgName, code } })
        }
    }
    const fullUpdate = userUpdate.modifiedCount > 0 || update.modifiedCount > 0;

    return res.status(fullUpdate ? 201 : 409).send({ success: fullUpdate, newAuth, message: fullUpdate ? "User settings updated successfuly" : "Action not performed" });
}))


module.exports = router;