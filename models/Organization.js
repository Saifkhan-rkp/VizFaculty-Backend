const { default: mongoose } = require("mongoose");

const organizationSchema = mongoose.Schema({
    name:{type:String, required:true},
    code:{type:String, required:true},
    auth:{type:mongoose.Types.ObjectId, required:true},
    departments:[
        {
            deptName:String,
            deptId:{type:mongoose.Types.ObjectId, ref:"Department"}
        }
    ],
    faculties:[
        {
            facultyName:{type:String},
            facultyId:{type:mongoose.Types.ObjectId, ref:"User"}
        }
    ]
},{timestamps:true});

module.exports = mongoose.model("organization", organizationSchema);