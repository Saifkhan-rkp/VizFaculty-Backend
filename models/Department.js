const { default: mongoose } = require("mongoose");

const departmentSchema = mongoose.Schema({
    deptHeadId:{type:mongoose.Types.ObjectId, ref:"User"},
    orgId:{ type:mongoose.Types.ObjectId, ref:"Organization"},
    deptName:{type:String, required:true },
    code:{type:String},
    faculties:[{type:mongoose.Types.ObjectId, ref:"User"}],
    timetables:[{type:mongoose.Types.ObjectId, ref:"Timetable"}]
},{timestamps:true});

module.exports = mongoose.model("department",departmentSchema);