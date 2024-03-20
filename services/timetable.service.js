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

const aggregateSubjectCount = async (id, deptId) => {
    const result = await Timetable.aggregate([
        // Unwind the schedule arrays
        { $match: { deptId: new mongoose.Types.ObjectId(deptId) } },
        { $project: { schedule: 1 } },
        { $addFields: { schedule: { $objectToArray: "$schedule" } } },
        // { $project: { 
        //     // Project only subject and assignTo fields
        //     "schedule.monday":1, "schedule.tuesday":1, "schedule.wednesday":1,
        //     "schedule.thursday":1, "schedule.friday":1, "schedule.saturday":1,
        //     "schedule.sunday":1,
        //     DummyUnwindField: { $ifNull: [null, [1.0]] }
        // }},
        { $unwind: "$schedule" },
        {
            $project: {
                comp: "$schedule.v"
            }
        },
        { $unwind: "$comp" },
        // {$addFields:{schedule: {}}}
        // Filter by the provided assignToId
        { $match: { "comp.assignTo": new mongoose.Types.ObjectId(id) } },
        // // Group by subject and count unique occurrences
        // { $group: { _id: "$comp.subject", teachingType: "comp.teachingType", count: { $sum: 1 } } },
        { $group: { _id: "$comp.teachingType", subjects: { $push: "$comp.subject" }, count: { $sum: 1 } } },
        // { $project: { _id: 1, teachingType: 1, count: 1 } }
    ]);
    return result;
}

exports.TimetableService = { getSingleDaySchedule, aggregateSubjectCount }
