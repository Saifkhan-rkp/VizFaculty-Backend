const { default: mongoose } = require("mongoose");

const salaryRequestSchema = new mongoose.Schema({
    applyDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    contactNo: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    facultyId: { type: mongoose.Types.ObjectId, ref: "faculties", required: true },
    forwardToHead: { fwdId: { type: mongoose.Types.ObjectId , required:true}, isForwarded: { type: Boolean, default: false }, status: { type: String, default: "pending" }, date: { type: Date } },
    forwardToAdminDept: { fwdId: { type: mongoose.Types.ObjectId , required:true}, isForwarded: { type: Boolean, default: false }, status: { type: String, default: "pending" }, date: { type: Date } },
}, { timestamps: true });

module.exports = mongoose.model("SalaryRequests", salaryRequestSchema);