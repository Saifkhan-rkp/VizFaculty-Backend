const { default: mongoose } = require("mongoose");

function roleRef(role) {
    if(role === "faculty")
        return "Faculty";
    else if(role === "adminDept")
        return "Organization";
    else if(role === "deptHead")
        return "Deparment";
}

const userSchema = mongoose.Schema({
    profilePhoto:{type:String, default:"default"},
    name: {
        type: String,
        required: [function () {return !this.remoteAdd},"register date is required"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already registered"],
    },
    password: {
        type: String,
        required: [function () {return !this.remoteAdd},"Password Is Required"],
    },
    role: {
        type: String,
        trim: true,
    },
    roleId:{
        type:mongoose.Types.ObjectId,
        refPath:"model_type"
    },
    model_type:{type:String, enum:["departments","organizations","faculties"]},
    verified: {
        type: Boolean,
        default: false
    },
    remoteAdd:{
        type:Boolean,
        default:false
    },
},{
    timestapms:true
});

// userSchema.set("timestamps",true);

module.exports = mongoose.model("users", userSchema);