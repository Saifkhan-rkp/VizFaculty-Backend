const { default: mongoose } = require("mongoose");
const { Attendance } = require("../models")
module.exports = {
    async getTodaysAttendance(fId, targetDate) {
        var startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        var endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const result = Attendance.findOne({ facultyId: fId, date: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() } });
        return result;
    },
    async getAttendanceByDateRange(fId, startDate, endDate) {
        var startOfDay = new Date(startDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        var endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const result = Attendance.find({ facultyId: fId, date: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() } });
        return result;
    },
    async aggregateSalary(roleId, month) {
        const result = await Attendance.aggregate([
            {
                $match: {
                    facultyId: new mongoose.Types.ObjectId(roleId),
                    $expr: {
                        "$eq": [{ "$month": "$date" }, parseInt(month)]
                    }
                }
            },
            {
                $project: {
                    // countTH: { $sum: { $cond: { "if": { "$eq": ["$attendance.teachingType", "TH"] }, then: 1, else: 0 } } },
                    // countPR: { $sum: { $cond: { "if": { "$eq": ["$attendance.teachingType", "PR"] }, then: 1, else: 0 } } },
                    // count: { $size: "$attendance" },
                    // totalAmount: { $sum: "$attendance.amount" },
                    attendance: "$attendance"
                },
            },
            {
                $unwind: "$attendance"
            },
            {
                $group: {
                    _id: 0,
                    totalTH: { $sum: { $cond: { "if": { "$eq": ["$attendance.teachingType", "TH"] }, then: 1, else: 0 } } },
                    totalPR: { $sum: { $cond: { "if": { "$eq": ["$attendance.teachingType", "PR"] }, then: 1, else: 0 } } },
                    totalAttendence: { $sum: 1 },
                    totalSalary: { $sum: "$attendance.amount" }
                }
            }

        ]);
        // console.log(result);
        return result[0] || { _id: 0, totalAttendence: 0, totalSalary: 0 };
    }
}