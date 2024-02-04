const { default: mongoose } = require("mongoose");

const salaryRequestSchema = new mongoose.Schema({
    applyDate:{type:Date},
    amount:{type:Number},
    userId:{type:mongoose.Types.ObjectId,ref:"users"},
    forwardToHead:{isForwarded:{type:Boolean},status:{type:String}},
    forwardToAdminDept:{isForwarded:{type:Boolean},status:{type:String}},
},{timestamps:true});

module.exports = mongoose.model("SalaryRequests",salaryRequestSchema);