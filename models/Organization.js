const { default: mongoose } = require("mongoose");

const organizationSchema = mongoose.Schema({
    name:{type:String},
    code:{type:String},
    auth:{type:mongoose.Types.ObjectId},
    departments:[{type:mongoose.Types.ObjectId, ref:"Department"}],
    faculties:[{type:mongoose.Types.ObjectId, ref:"User"}]
},{timestamps:true});

module.exports = mongoose.model("organization", organizationSchema);