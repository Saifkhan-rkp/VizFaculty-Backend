const { default: mongoose } = require("mongoose");

const departmentSchema = mongoose.Schema({
    deptHeadId:{type:mongoose.Types.ObjectId, ref:"users", required:true},
    orgId:{ type:mongoose.Types.ObjectId, ref:"organizations"},
    deptName:{type:String, required:true },
    code:{type:String, required:true},
    faculties:[{type:mongoose.Types.ObjectId, ref:"users"}],
    timetables:[{type:mongoose.Types.ObjectId, ref:"timetables"}]
},{timestamps:true});

module.exports = mongoose.model("departments",departmentSchema);