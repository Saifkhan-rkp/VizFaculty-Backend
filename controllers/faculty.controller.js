const { default: mongoose } = require("mongoose");
const { rolesAndRef, addUser } = require("../configs/helpers");
const { Faculty, Department, User, Timetable, Attendance } = require("../models");
const { TimetableService } = require("../services/timetable.service");
const catchAsync = require("../configs/catchAsync");
const { aggregateSalary } = require("../services/attendance.service");

async function addFaculty(facultyBody) {
    const faculty = new Faculty(facultyBody);
    await faculty.save();
    const userUpdate = await User.updateOne(
        { _id: facultyBody.faculty },
        {
            $set: {
                role: rolesAndRef.faculty.role,
                model_type: rolesAndRef.faculty.ref,
                roleId: faculty._id,
            },
        }
    );
    const updateDept = await Department.updateOne(
        { _id: faculty.inDepartment },
        {
            $push: {
                faculties: {
                    $each: [faculty._id],
                    $slice: -10,
                },
            },
        }
    );
    return {
        success: true,
        faculty,
        isRoleUpdated: userUpdate.modifiedCount > 0,
        isDeptUpdated: updateDept.modifiedCount > 0,
    }; //isOrgUpdated: modifyOrg.modifiedCount>0
}

const createFaculty = async (req, res, next) => {
    try {
        const {
            email,
            name = "User",
            abbrivation,
            hasAccessOf = "none",
        } = req.body;
        const { roleId, userId } = req.user;
        // const userId = "643a8ec1bc092fda8eb5384e";
        // const roleId = "643aaad2b66fef684d8bad81";
        const userAlive = await User.findOne({ email });
        const getDept = await Department.findById(roleId);
        // console.log(getDept);
        if (!getDept)
            return next({
                statusCode: 401,
                message: "You are not authorized to Add faculty",
            });

        const userDetail = {};
        // console.log("here 2");
        if (userAlive) {
            // console.log("here 3");
            userDetail.id = userAlive.id;
        } else {
            await addUser({
                intro: `You are invited for role Faculty of ${getDept.deptName}, please complete registration process.`,
                email,
                token: "something",
            })
                .then((user) => {
                    userDetail.id = user.id;
                })
                .catch((err) => next(err));
        }
        const result = await addFaculty({
            name,
            abbrivation,
            inDepartment: roleId,
            inOrganization: getDept.orgId,
            addedBy: userId,
            faculty: userDetail.id,
            hasAccessOf,
        });
        if (result.success) {
            res
                .status(201)
                .send({
                    success: true,
                    message: "Faculty Added to your Deparment Successfully!",
                    ...result,
                });
        } else if (!result.success) {
            result.statusCode = 500;
            next(result);
        }
        // res.send({success:true, message:"Faculty Created"})
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

const getFaculty = async (req, res, next) => {
    try {
        const { fId } = req.params;
        if (!mongoose.isValidObjectId(fId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const faculty = await Faculty.findById(fId, { _id: 0 }).populate("faculty");
        if (!faculty)
            return next({ message: "Not Found/ Not Exists", statusCode: 404 });
        res.status(201).send({ success: true, message: "found", faculty });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

const modifyFaculty = async (req, res, next) => {
    try {
        const { fId } = req.params;
        const toModify = req.body;
        if (!mongoose.isValidObjectId(fId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const isFacultyModified = await Faculty.updateOne(
            { _id: fId },
            { $set: toModify, $currentDate: { updatedAt: true } }
        );
        if (isFacultyModified.modifiedCount > 0)
            return res
                .status(201)
                .send({ success: true, message: "Faculty Updated Successfully!" });
        res.send({ success: false, message: "Unable to update Faculty" });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

const deleteFaculty = async (req, res, next) => {
    try {
        const { fId } = req.params;
        // const {roleId} = req.user;
        const roleId = "64384ff5def198fea620e35a";
        if (!mongoose.isValidObjectId(fId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const deletedFaculty = await Faculty.deleteOne({ _id: fId });
        if (deletedFaculty.deletedCount === 0)
            return next({
                statusCode: 400,
                message: "Unable to delete Faculty/ may it does'nt exists",
            });

        const userWithRole = await User.updateOne(
            { roleId: fId },
            {
                $set: { role: "normal" },
                $unset: { model_type: 1, roleId: 1 },
                $currentDate: { updatedAt: true },
            }
        );
        const removeFacultyFromDept = await Department.updateOne(
            { faculties: fId },
            {
                $pull: {
                    faculties: fId,
                },
            }
        );
        if (deletedFaculty.deletedCount > 0)
            return res
                .status(201)
                .send({
                    success: true,
                    message: "Faculty Deleted Successfully",
                    isUserModified: userWithRole.modifiedCount > 0,
                    isDeptUpdated: removeFacultyFromDept.modifiedCount > 0,
                });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

const getSingleDaySchedule = async (req, res, next) => {
    try {
        const { day } = req.params;
        const { userId, roleId } = req.user;
        const faculty = await Faculty.findOne({ _id: roleId }, { inDepartment: 1 });
        // console.log(faculty.inDepartment);
        // const schedules = await Timetable.find({deptId:faculty.inDepartment},{schedule:{$eq:["schedule.monday.$.assignTo",roleId]}});//"schedules.monday.assignTo":roleId
        const schedules = await TimetableService.getSingleDaySchedule(
            faculty?.inDepartment,
            roleId,
            day
        );
        // console.log(schedules[0]?.schedules);
        res.status(201).send({ schedules });
    } catch (error) {
        console.log(error);
        error.statusCode = 500;
        next(error);
    }
};

const getFaculties = async (req, res, next) => {
    try {
        const { role, roleId } = req.user;
        const search = {};
        if (role === "deptHead") search.inDepartment = roleId;
        if (role === "admindept") search.inOrganization = roleId;
        const faculties = await Faculty.find(search).populate([
            { path: "faculty", select: "name email profile" },
            { path: "inDepartment", select: "_id deptName code" },
        ]);
        res.send({ success: true, faculties });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};
// $push: {
// $cond: {
//     if:{$eq:["$schedules.assignTo",new mongoose.Types.ObjectId(roleId)]},
//     then:"$schedules",
//     else:{}
// }

// }
// $push:{$elemMatch:{"$schedules.assignTo":roleId}}

const getFacultyHeaderStatus = catchAsync(async (req, res, next) => {
    const { roleId } = req.user;
    const { month } = req.query;
    const faculty = await Faculty.findOne({ _id: roleId }, { inDepartment: 1 });
    const aggrSalary = await aggregateSalary(roleId, month);
    const totalSubject = await TimetableService.aggregateSubjectCount(roleId, faculty.inDepartment);
    // console.log(totalSubject)
    res.send({ 
        totalTH: aggrSalary?.totalTH || 0, 
        totalPR: aggrSalary?.totalPR,
        totalSalary: aggrSalary?.totalSalary || 0, 
        totalAttendence: aggrSalary?.totalAttendence || 0, 
        totalSubject 
    })
});
module.exports = {
    createFaculty,
    getFaculty,
    modifyFaculty,
    deleteFaculty,
    getSingleDaySchedule,
    getFaculties,
    getFacultyHeaderStatus
};

// const schedules = await Timetable.aggregate([
//     { $match: { deptId: faculty.inDepartment } },
//     //group first then project then group again maybe this will work
//     {
//         $project: {
//             schedules: {
//                 $filter:{
//                     input:"$schedule." + dayOfDays,
//                     as:"item",
//                     cond:{$eq:["$$item.assignTo",new mongoose.Types.ObjectId(roleId)]}
//                 }
//             }
//         }
//     },
//     { $unwind: "$schedules" },
//     {
//         $group:{
//             _id:"$schedules.assignTo",
//             schedules:{$push:"$schedules"}
//         }
//     },
//     {
//         $group:{
//             _id:null,

//         }
//     }
// ])
