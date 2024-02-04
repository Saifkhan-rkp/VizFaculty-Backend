const { default: mongoose } = require("mongoose");

const departmentSchema = new mongoose.Schema({
    deptHeadId:{type:mongoose.Types.ObjectId, ref:"users", required:true},
    orgId:{ type:mongoose.Types.ObjectId, ref:"organizations"},
    deptName:{type:String, required:true },
    code:{type:String, required:true},
    faculties:[{type:mongoose.Types.ObjectId, ref:"users"}],
    timetables:[{type:mongoose.Types.ObjectId, ref:"timetables"}],
    rates:{
        TH:Number,
        PR:Number,
        TU:Number
    }
},{timestamps:true});

module.exports = mongoose.model("departments",departmentSchema);