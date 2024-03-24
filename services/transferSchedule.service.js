const { TransferSchedule } = require("../models");

exports.TransferScheduleService = {
    async getTodaysTransferedToMe(transferedTo, date) {
        var startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        var endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        console.log(startOfDay, endOfDay);
        const result = await TransferSchedule.find({ transferTo: transferedTo });
        return result;
    },
    async getTodaysTransfered(transferedFrom, date) {
        var startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        var endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        console.log(startOfDay, endOfDay);
        const result = await TransferSchedule.find({ transferFrom: transferedFrom, transferDate:startOfDay });
        return result;
    }
}