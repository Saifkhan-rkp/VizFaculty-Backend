const { default: mongoose } = require("mongoose");
const { Attendance, Timetable, Faculty } = require("../models");
const catchAsync = require("../configs/catchAsync");
const { TimetableService } = require("../services/timetable.service");
const facultyService = require("../services/faculty.service");
const attendanceService = require("../services/attendance.service");
const departmentService = require("../services/department.service");
const { timeDifference } = require("../configs/helpers");
const { TransferScheduleService } = require("../services/transferSchedule.service");

const getAttendance = async (req, res, next) => {
  try {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const { date } = req.params;
    const { roleId } = req.user;
    const dates = date.split("&");
    const faculty = await Faculty.findById(roleId);
    if (dates.length === 1) {
      const newDate = new Date(date);
      const dayOfDays = days[1];
      const recs = await Attendance.find({ facultyId: roleId, date: newDate });
      // console.log(recs.length);
      if (recs.length < 1) {
        const schedules = await Timetable.aggregate([
          { $match: { deptId: faculty.inDepartment } },
          {
            $addFields: {
              schedule: {
                $map: {
                  input: "$schedule." + dayOfDays,
                  as: "sch",
                  in: {
                    $cond: [
                      {
                        $eq: [
                          "$$sch.assignTo",
                          new mongoose.Types.ObjectId(roleId),
                        ],
                      },
                      {
                        $mergeObjects: [
                          "$$sch",
                          {
                            name: "$name",
                          },
                        ],
                      },
                      {},
                    ],
                  },
                },
              },
            },
          },
          { $unwind: "$schedule" },
          {
            $group: {
              _id: "$schedule.assignTo",
              schedules: { $push: "$schedule" },
            },
          },
        ]);
        if (schedules[0]._id === null) {
          schedules.shift();
        }
        return res.send({ success: true, recs: schedules[0] });
      }
      res.send({ success: true, recs });
    } else {
    }
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const submitAttendance = async (req, res, next) => {
  try {
    const { day, date, attendanceArray } = req.body;
    // console.log(req.body);
    const { roleId } = req.user;
    const faculty = await facultyService.getFacultyDepartment(roleId);
    const dept = await departmentService.getDepartmentDetails(
      faculty.inDepartment
    );
    attendanceArray.forEach((attendance) => {
      attendance.rate = dept.rates[attendance.teachingType];
      attendance.totalHours = timeDifference(
        attendance.timeFrom,
        attendance.timeTo
      );
      attendance.amount = attendance.rate * attendance.totalHours;
      return attendance;
    });
    // console.log(attendanceArray);
    const att = await Attendance.findOneAndUpdate(
      { facultyId: roleId, date: date },
      { day, attendance: attendanceArray, date, facultyId: roleId },
      { upsert: true }
    );
    // att.save();
    // console.log(att);
    res.send({ success: true, message: "attendance submitted..!" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const todaysAttendance = catchAsync(async (req, res, next) => {
  const { roleId, userId } = req.user;
  const { date } = req.params;
  // const { "x-date": opdate } = req.headers;
  const reqDate = new Date(date);
  // console.log("dates --> ",date, reqDate);
  const faculty = await facultyService.getFacultyDepartment(roleId);
  const attendance = await attendanceService.getTodaysAttendance(
    faculty._id,
    reqDate
  );
  const schedule = await TimetableService.getSingleDaySchedule(
    faculty.inDepartment,
    roleId,
    reqDate.getDay()
  );
  const transfered = await TransferScheduleService.getTodaysTransfered(faculty._id, reqDate);
  const transferedToMe = await TransferScheduleService.getTodaysTransferedToMe(faculty._id, reqDate);
  const attCopy = attendance?.toObject();
  if (schedule.length > 0) {
    if (attendance?.attendance.length > 0) {
      attCopy?.attendance.forEach(att => (att.marked = true));
      // console.log(attCopy.attendance);
      schedule.forEach((scd) =>
      (scd.marked = attendance?.attendance.some((att) =>
      att?._id.equals(scd?._id)
      ))
      );
    }
    if (transfered.length > 0) {
      schedule.forEach((scd) =>
      (scd.transfered = transfered.some((trnf) =>
      trnf?.transferScheduleId.equals(scd?._id)
      )));
    }
  } else {
    schedule.forEach((scd) => (scd.marked = false));
  }
  const tempTranferTome=[]
  transferedToMe.forEach((scd) => 
    // scd.toObject()
    tempTranferTome.push({...scd._doc,newSubject: attendance?.attendance.find((att) => att?._id.equals(scd?._id))?.subject, marked : attendance?.attendance.some((att) => att?._id.equals(scd?._id))}) 
  );
  // console.log("Tr to me schedule -> ", tempTranferTome);
  res.status(201).send({ success: true, schedule, attendance: attCopy, transfered: tempTranferTome });
});

const getAttendanceByMonth = catchAsync(async (req, res, next) => {
  const { month } = req.params;
  const user = req.user;
  // console.log("month & user", parseInt(month), user);
  const result = await Attendance.aggregate([{
    $match: {
      facultyId: new mongoose.Types.ObjectId(user.roleId),
      $expr: {
        "$eq": [{ "$month": "$date" }, parseInt(month)]
      }
    }

  }]);
  // console.log(result);
  res.send({ success: true, data: result })
});

const submitNFCAttendance = catchAsync(async (req, res, next) => {
  const { roleId, date } = req.params;
  const reqDate = new Date(date);
  const faculty = await facultyService.getFacultyDepartment(roleId);
  const dept = await departmentService.getDepartmentDetails(
    faculty.inDepartment
  );
  const schedule = await TimetableService.getSingleDaySchedule(
    faculty.inDepartment,
    roleId,
    reqDate.getDay()
  );
  schedule.forEach((attendance) => {
    attendance.rate = dept.rates[attendance.teachingType];
    attendance.totalHours = timeDifference(
      attendance.timeFrom,
      attendance.timeTo
    );
    attendance.amount = attendance.rate * attendance.totalHours;
    return attendance;
  });
  // console.log(date.split(" ")[0].toUpperCase(), scshedule, date, roleId);

  const att = await Attendance.findOneAndUpdate(
    { facultyId: roleId, date: date },
    { day: date.split(" ")[0].toUpperCase(), attendance: schedule, date, facultyId: roleId },
    { upsert: true, new: true }
  );
  res.send({ success: Object.keys(att.toObject()).length > 0, message: "Attendance recorded" })
})
module.exports = { getAttendance, submitAttendance, todaysAttendance, getAttendanceByMonth, submitNFCAttendance };

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
