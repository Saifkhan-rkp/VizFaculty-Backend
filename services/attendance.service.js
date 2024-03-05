const { Attendance } = require("../models")
module.exports = {
    async getTodaysAttendance(fId, targetDate) {
        var startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        var endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        
        const result = Attendance.findOne({ facultyId: fId, date: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() } });
        return result;
    }
}