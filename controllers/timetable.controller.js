const { default: mongoose } = require("mongoose");
const { Timetable, Department } = require("../models");


const createTimetable = async (req, res, next) => {
    try {
        const ttBody = req.body;
        const roleId = "643aaad2b66fef684d8bad81";//req.user.roleId
        ttBody.deptId = roleId;
        ttBody.createdBy = new mongoose.Types.ObjectId("64384ff1def198fea620e358");//req.user.userId
        ttBody.lastModifiedBy = new mongoose.Types.ObjectId("64384ff1def198fea620e358"); //req.user.userId
        const tt = new Timetable(ttBody);
        await tt.save();
        const updateDept = await Department.updateOne({_id:roleId},
            {
                $push: {
                    timetables:{
                        $each:[tt._id],
                        $slice:-10
                    }
                }
            })
        res.status(201).send({ success: true, message: "Timetable Added Successfully",isAddedInDept: updateDept.modifiedCount>0 });//isAddedInDept: updateDept.modifiedCount>0 
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

const modifyTimetable = async (req, res, next) => {
    try {
        const modifiedData = req.body;
        const { ttId } = req.params;
        if (!ttId || !mongoose.isValidObjectId(ttId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        // modifiedData.lastModifiedBy = req.user.userId;
        const modified = await Timetable.updateOne({ _id: new mongoose.Types.ObjectId(ttId) }, { $set: modifiedData, $currentDate: { updatedAt: true } });
        if (modified.modifiedCount > 0) 
            return res.status(201).send({ success: true, message: "Timetable Modified successfully" });
        
        next({ statusCode: 304, message: "Unable to modify Timetable" })

    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const getTimetable = async (req, res, next) => {
    try {
        const { ttId } = req.params;
        if (!mongoose.isValidObjectId(ttId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const tt = await Timetable.findOne({ _id: new mongoose.Types.ObjectId(ttId) })
        if (!tt)
            return res.status(404).send({ success: false, message: "Not Found/Maybe deleted" })
        res.status(201).send({ success: true, message: "tt found", tt });
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const deleteTimeTable = async (req, res, next) => {
    try {
        const { ttId } = req.params;
        if (!mongoose.isValidObjectId(ttId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const deletedTT = await Timetable.deleteOne({ _id: ttId });
        const updateDept = await Department.updateOne({_id:roleId},
            {
                $pull: {
                    timetables:ttId
                }
            })
        if (deletedTT.deletedCount > 0)
            return res.status(201).send({ success: true, message: "Timetable Deleted Successfully", isDeptUpdated: updateDept.modifiedCount>0 });//isDeptUpdated: updateDept.modifiedCount>0
        next({ statusCode: 400, message: "Unable to delete Timetable/may it does'nt exists" });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

const getAllTimetables = async (req,res,next) =>{
    try {
        const {roleId} = req.user;
        const timetables = await Timetable.find({deptId:roleId});
        res.send({success:true,message:"found", timetables, ttCount:timetables.length});
    } catch (error) {
        error.statusCode =500;
        next(error)
    }
};
module.exports = { createTimetable, modifyTimetable, getTimetable, deleteTimeTable, getAllTimetables }