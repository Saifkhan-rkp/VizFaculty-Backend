const { default: mongoose } = require("mongoose");

const departmentSchema = mongoose.Schema({
    deptName:{type:String, required:true },
    hasAuth:{type:mongoose.Types.ObjectId, ref:"User"},
    code:{type:String},
    faculties:[{type:mongoose.Types.ObjectId, ref:"User"}],
    timetables:[{type:mongoose.Types.ObjectId, ref:"Timetable"}]
},{timestamps:true});

module.exports = mongoose.model("department",departmentSchema);