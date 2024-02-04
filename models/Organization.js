const { default: mongoose } = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name:{type:String, required:true},
    code:{type:String, required:true},
    auth:{type:mongoose.Types.ObjectId, ref:"users", required:true},
    departments:[
        {
            deptName:String,
            deptId:{type:mongoose.Types.ObjectId, ref:"departments"}
        }
    ],
    faculties:[
        {
            facultyName:{type:String},
            facultyId:{type:mongoose.Types.ObjectId, ref:"faculties"}
        }
    ]
},{timestamps:true});

module.exports = mongoose.model("organizations", organizationSchema);