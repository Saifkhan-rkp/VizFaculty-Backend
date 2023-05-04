const { default: mongoose } = require("mongoose");

const scheduleSchema = mongoose.Schema({
    subject:{type:String, trim:true},
    timeFrom:{type:String},
    timeTo:{type:String},
    teachingType:{type:String, trim:true},
    assignTo:{type:mongoose.Types.ObjectId,ref:"faculties"}
});
const timetableSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    schedule:{
        monday:[scheduleSchema],
        tuesday:[scheduleSchema],
        wednesday:[scheduleSchema],
        thursday:[scheduleSchema],
        friday:[scheduleSchema],
        saturday:[scheduleSchema],
        sunday:[scheduleSchema]
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    lastModifiedBy:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    deptId:{
        type:mongoose.Types.ObjectId,
        ref:"departments"
    }, 
},{timestamps:true});

module.exports = mongoose.model("timetables", timetableSchema);