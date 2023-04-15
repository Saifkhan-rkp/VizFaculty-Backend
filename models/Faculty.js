const { default: mongoose } = require("mongoose");


const facultySchema = mongoose.Schema({
    abbrivation:{type:String},
    template:{type:String},
    inDepartment:{type:mongoose.Types.ObjectId, ref:"Department"},
    inOrganization:{type:mongoose.Types.ObjectId, ref:"Organization"},
    addedBy:{type:mongoose.Types.ObjectId, ref:"User"},
    hasAccessOf:{type:String},
    isActive:{type:Boolean, default:false}
},{timestamps:true});

module.exports = mongoose.model("faculty", facultySchema);