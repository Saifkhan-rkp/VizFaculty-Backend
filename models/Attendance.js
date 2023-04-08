const { default: mongoose } = require("mongoose");

const attendanceSchema = mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    day:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true
    },
    yearAndBranch:{
        type:String,
        required:true
    },
    teachingType:{
        type:String,
        required:true
    },
    sessionTime:{
        
    },
    totalHours:{
        type:Number,
        required:true
    },
    rate:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestapms:true
});

module.exports = mongoose.model("attendance",attendanceSchema);