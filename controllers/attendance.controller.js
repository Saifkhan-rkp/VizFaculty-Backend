
const { default: mongoose } = require("mongoose");
const { Attendance, Timetable, Faculty } = require("../models");
const catchAsync = require("../configs/catchAsync");
const { TimetableService } = require("../services/timetable.service");

const getAttendance = async (req, res, next) => {
    try {
        const days = ['sunday', "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const { date } = req.params;
        const { roleId } = req.user;
        const dates = date.split("&")
        const faculty = await Faculty.findById(roleId);
        if (dates.length === 1) {
            const newDate = new Date(date);
            const dayOfDays = days[1];
            const recs = await Attendance.find({ facultyId: roleId, date: newDate })
            console.log(recs.length);
            if (recs.length < 1) {
                const schedules = await Timetable.aggregate([
                    { $match: { deptId: faculty.inDepartment } },
                    {
                      "$addFields": {
                        schedule: {
                          $map: {
                            input: "$schedule."+dayOfDays,
                            as: "sch",
                            in: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$sch.assignTo",
                                    new mongoose.Types.ObjectId(roleId)
                                  ]
                                },
                                {
                                  "$mergeObjects": [
                                    "$$sch",
                                    {
                                      name: "$name"
                                    }
                                  ]
                                },
                                {}
                              ]
                            }
                          }
                        }
                      }
                    },
                    { $unwind: "$schedule" },
                    {
                        $group:{
                            _id:"$schedule.assignTo",
                            schedules:{$push:"$schedule"}
                        }
                    }
                  ]);
                if (schedules[0]._id===null) {
                  schedules.shift();
                }
                return res.send({ success: true, recs: schedules[0] });
            }
            res.send({ success: true, recs })
        } else {

        }

    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const submitAttendance = async (req, res, next) => {
    try {
        const body = req.body;
        const {roleId} = req.user;
        const att = new Attendance(body);
        att.save();
        res.send({success:true, message:"attendance submitted..!"})
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const todaysAttendance = catchAsync(async (req, res, next)=>{
    const {roleId, userId } = req.user;
    const {date } = req.params;
    const reqDate = new Date(date);
    const schedule = TimetableService.getSingleDaySchedule(deptId, roleId, reqDate.getDay()); 
    
});

module.exports = { getAttendance, submitAttendance, todaysAttendance };

// // {$mergeObjects:[{schedule:},{yearAndBranch:"$name"}]}
// { $match: { deptId: faculty.inDepartment } },
//                     //group first then project then group again maybe this will work
//                     {
//                         $group: {
//                             _id: "$name",
//                             Myschedules: { $first: "$schedule." + dayOfDays}
//                         }
//                     },
//                     {
//                         $project: {
//                             _id: 1,
//                             schedules: {
//                                 $filter: {
//                                     input: "$Myschedules",
//                                     as: "item",
//                                     cond: { $eq: ["$$item.assignTo", new mongoose.Types.ObjectId(roleId)] }
//                                 }
//                             }
//                         }
//                     },
                    
//                     {
//                         $group: {
//                             _id: "$schedules.$.assignTo",
//                             schedules: {}
//                         }
//                     },