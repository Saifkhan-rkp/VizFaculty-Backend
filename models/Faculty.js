const { default: mongoose } = require("mongoose");


const facultySchema = new mongoose.Schema({
    abbrivation:{type:String, required:true},
    faculty:{type:mongoose.Types.ObjectId, ref:"users", required:true},
    template:{type:String},
    inDepartment:{type:mongoose.Types.ObjectId, ref:"departments", required:true},
    inOrganization:{type:mongoose.Types.ObjectId, ref:"organizations"},
    addedBy:{type:mongoose.Types.ObjectId, ref:"users"},
    hasAccessOf:{type:String, enum:["none", "timetable", "faculties"]},
    isActive:{type:Boolean, default:false}
},{timestamps:true});

module.exports = mongoose.model("faculties", facultySchema);