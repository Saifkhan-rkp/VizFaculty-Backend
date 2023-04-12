const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
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