const { default: mongoose } = require("mongoose");
const { Constants } = require("../configs/constants");
const { Timetable } = require("../models");


const getSingleDaySchedule = async (deptId, roleId, day) => {
    const dayOfDays = Constants.DAYS[day];
    const result = await Timetable.aggregate([
        { $match: { deptId: deptId } },
        //group first then project then group again maybe this will work
        {
            $group:{
                _id:"$_id",
                Myschedules:{$first:"$schedule."+dayOfDays}
            }
        },
        {
            $project: {
                schedules:{
                    $filter:{
                        input:"$Myschedules",
                        as:"item",
                        cond:{$eq:["$$item.assignTo",new mongoose.Types.ObjectId(roleId)]}
                    }
                }
            }
        },
        { $unwind: "$schedules" },
        {
            $group:{
                _id:"$schedules.assignTo",
                schedules:{$push:"$schedules"}
            }
        },
    ]);

    return result[0]?.schedules || [];

};

exports.TimetableService = { getSingleDaySchedule }
