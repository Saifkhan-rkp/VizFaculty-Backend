const { default: mongoose } = require("mongoose");

const timetableSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    schedule:{
        monday:[],
        tuesday:[],
        wednesday:[],
        thursday:[],
        friday:[],
        saturday:[],
        sunday:[]
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },

});

module.exports = mongoose.model("timetable", timetableSchema);