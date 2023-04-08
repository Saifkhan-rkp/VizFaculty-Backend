const { default: mongoose } = require("mongoose");

const salaryRequestSchema = mongoose.Schema({
    applyDate:{type:Date},
    userId:{type:mongoose.Types.ObjectId,ref:"User"},
    forwardToHead:{isForwarded:{type:Boolean},status:{type:String}},
    forwardToAdminDept:{isForwarded:{type:Boolean},status:{type:String}},
},{timestamps:true});

module.exports = mongoose.model("SalaryRequest",salaryRequestSchema);