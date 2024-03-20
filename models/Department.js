const { default: mongoose } = require("mongoose");

const departmentSchema = new mongoose.Schema({
    deptHeadId:{type:mongoose.Types.ObjectId, ref:"users", required:true, unique:true},
    orgId:{ type:mongoose.Types.ObjectId, ref:"organizations"},
    deptName:{type:String, required:true },
    code:{type:String, required:true},
    faculties:[{type:mongoose.Types.ObjectId, ref:"users"}],
    timetables:[{type:mongoose.Types.ObjectId, ref:"timetables"}],
    rates:{
        TH:{type:Number, default:0},
        PR:{type:Number, default:0},
        TU:{type:Number, default:0}
    }
},{timestamps:true});

module.exports = mongoose.model("departments",departmentSchema);