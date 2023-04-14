const { default: mongoose } = require("mongoose");
const { Timetable } = require("../models");


const createTimetable = async (req, res, next) => {
    try {
        const ttBody = req.body;
        ttBody.createdBy = new mongoose.Types.ObjectId("64384ff1def198fea620e358");
        const tt = new Timetable(ttBody);
        await tt.save();
        res.status(201).send({success:true, message:"Timetable Added Successfully"});        
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const modifyTimetable = async (req, res, next) => {
    try {
        const modifiedData = req.body;
        const {ttId} = req.params;
        if (!ttId || !mongoose.isValidObjectId(ttId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const modified = await Timetable.updateOne({_id:new mongoose.Types.ObjectId(ttId)},{$set:modifiedData, $currentDate:{updatedAt:true}});
        if (modified.modifiedCount>0) {
            res.status(201).send({success:true, message:"Timetable Modified successfully"});
        }else{
            next({statusCode:304,message:"Unable to modify Timetable"})
        }

    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const getTimetable = async (req, res, next) =>{
    try {
        const {ttId} = req.params;
        if (!mongoose.isValidObjectId(ttId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const tt = await Timetable.findOne({_id:new mongoose.Types.ObjectId(ttId)})
        if(!tt)
            return res.status(404).send({success:false, message:"Not Found/Maybe deleted"})
        res.status(201).send({success:true, message:"tt found", tt});
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};
module.exports = {createTimetable, modifyTimetable, getTimetable}