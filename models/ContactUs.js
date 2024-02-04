const { default: mongoose } = require("mongoose");


const contactUsSchema = new mongoose.Schema({
    fullName:{type:String, trim:true, required:true},
    email:{type:String, trim:true, required:true},
    message:{type:String, trim:true, required:true}
},{timestamps:true});

module.exports = mongoose.model("contact", contactUsSchema);