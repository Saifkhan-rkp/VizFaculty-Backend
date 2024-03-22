const { default: mongoose } = require("mongoose");


const TransferScheduleSchema = new mongoose.Schema({
    transferDate: { type: Date, required: true },
    subject: { type: String, trim: true },
    timeFrom: { type: String },
    timeTo: { type: String },
    teachingType: { type: String, trim: true },
    transferFrom: { type: mongoose.Types.ObjectId, ref: "faculties" },
    transferTo: { type: mongoose.Types.ObjectId, ref: "faculties" }
}, {
    timestamps: true
})

module.exports = mongoose.model("TransferSchedule", TransferScheduleSchema);