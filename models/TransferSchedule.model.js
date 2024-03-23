const { default: mongoose } = require("mongoose");


const TransferScheduleSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    subject: { type: String, trim: true },
    timeFrom: { type: String },
    timeTo: { type: String },
    teachingType: { type: String, trim: true },
    transferScheduleId: { type: mongoose.Types.ObjectId },
    transferDate: { type: Date, required: true },
    transferFrom: { type: mongoose.Types.ObjectId, ref: "faculties" },
    transferTo: { type: mongoose.Types.ObjectId, ref: "faculties" }
}, {
    timestamps: true
})

module.exports = mongoose.model("TransferSchedule", TransferScheduleSchema);