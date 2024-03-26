const { default: mongoose } = require("mongoose");
const { SalaryRequest } = require("../models")



module.exports = {
    async getRequestsByForwordStatus(forwordedTo, fwdId) {
        const result = await SalaryRequest.find({ [`${forwordedTo}.isForwarded`]: true, [`${forwordedTo}.fwdId`]: fwdId })
            .populate([
                { path: "userId", select: "name profilePhoto" },
            ]);
        return result;
    },
    async expenditureAggregation(forwordedTo, fwdId) {
        const result = await SalaryRequest.aggregate([{
            $match: {
                [`${forwordedTo}.status`]: "approved",
                [`${forwordedTo}.fwdId`]: new mongoose.Types.ObjectId(fwdId)
            }
        }, {
            $group: {
                _id: [`$${forwordedTo}.fwdId`],
                expenditure: { $sum: "$amount" }
            }
        }]);
        return result[0] || {};
    }
}