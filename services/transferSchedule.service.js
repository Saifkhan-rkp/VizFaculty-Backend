const { TransferSchedule } = require("../models");

exports.TransferScheduleService = {
    async getTodaysTransferedToMe(transferedTo, date) {
        var startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        var endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const result = await TransferSchedule.find({ 
            transferTo: transferedTo, 
            transferDate: { $gte: startOfDay, $lte: endOfDay } 
        })
        .select("-transferScheduleId -transferDate -assignTo -transferTo -userId")
        .populate({ path: "transferFrom", select: "abbrivation" });
        return result;
    },
    async getTodaysTransfered(transferedFrom, date) {
        var startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        var endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const result = await TransferSchedule.find({ 
            transferFrom: transferedFrom, 
            transferDate: { $gte: startOfDay, $lte: endOfDay } 
        }, 
        { 
            transferScheduleId: 1, 
            transferTo:1 
        });
        return result;
    }
}