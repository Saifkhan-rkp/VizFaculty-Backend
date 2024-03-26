const { default: mongoose } = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    day:{
        type:String,
        required:true,
    },
    attendance:[{
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
        timeFrom:{type:String},
        timeTo:{type:String},
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
        isTransfered:{
            type:Boolean,
            default:false
        }
    }],
    facultyId:{
        type:mongoose.Types.ObjectId,
        ref:"faculties",
        required:true
    }
},{
    timestapms:true
});

module.exports = mongoose.model("attendances",attendanceSchema);