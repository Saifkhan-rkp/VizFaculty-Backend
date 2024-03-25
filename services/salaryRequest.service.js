const { SalaryRequest } = require("../models")



module.exports = {
    async getRequestsByForwordStatus(forwordedTo, fwdId) {
        const result = await SalaryRequest.find({ [`${forwordedTo}.isForwarded`]: true, [`${forwordedTo}.fwdId`]: fwdId })
            .populate([
                { path: "userId", select: "name profilePhoto" },
            ]);
        return result;
    }
}