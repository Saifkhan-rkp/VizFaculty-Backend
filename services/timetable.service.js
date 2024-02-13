const { default: mongoose } = require("mongoose");
const { Constants } = require("../configs/constants");
const { Timetable } = require("../models");


const getSingleDaySchedule = async (deptId, roleId, day) => {
    const dayOfDays = Constants.DAYS[day];
    // console.log(dayOfDays, deptId, roleId, day);
    const result = await Timetable.aggregate([
        { $match: { deptId: new mongoose.Types.ObjectId(deptId) } },
        //group first then project then group again maybe this will work
        {
            $group: {
                _id: "$name",
                // name1:"$name",
                Myschedules: { $first: "$schedule." + dayOfDays }
            }
        },
        {
            $project: {
                // _id:"$name1",
                schedules: {
                    $filter: {
                        input: "$Myschedules",
                        as: "item",
                        cond: { $eq: ["$$item.assignTo", new mongoose.Types.ObjectId(roleId)] }
                    }
                }
            }
        },
        {
            $addFields: {
                "schedule": {
                    $map: {
                        input: "$schedules",
                        as: "slot",
                        in: {
                            $mergeObjects: [
                                "$$slot",
                                {
                                    yearAndBranch: "$_id" // Assuming deptId represents yearAndBranch
                                }
                            ]
                        }
                    }
                }
            }
        },
        { $unwind: "$schedule" },
        {
            $group: {
                _id: "$schedule.assignTo",
                schedules: { $push: "$schedule" }
            }
        },
    ]);
    // console.log(result);
    return result[0]?.schedules || [];

};

exports.TimetableService = { getSingleDaySchedule }
