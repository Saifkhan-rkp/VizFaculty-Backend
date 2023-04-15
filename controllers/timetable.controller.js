const { default: mongoose } = require("mongoose");
const { Timetable, Department } = require("../models");


const createTimetable = async (req, res, next) => {
    try {
        const ttBody = req.body;
        ttBody.createdBy = new mongoose.Types.ObjectId("64384ff1def198fea620e358");//req.user.id
        ttBody.lastModifiedBy = new mongoose.Types.ObjectId("64384ff1def198fea620e358"); //req.user.id
        const tt = new Timetable(ttBody);
        await tt.save();
        // const updateDept = await Department.updateOne({},
        //     {
        //         $push: {
        //             timetables:{
        //                 $each:[tt._id],
        //                 $slice:-10
        //             }
        //         }
        //     })
        res.status(201).send({ success: true, message: "Timetable Added Successfully", });//isAddedInDept: updateDept.modifiedCount>0 
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
        // modifiedData.lastModifiedBy = req.user.id;
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
        if (deletedTT.deletedCount > 0)
            return res.status(201).send({ success: true, message: "Timetable Deleted Successfully" });
        next({ statusCode: 400, message: "Unable to delete Timetable/may it does'nt exists" });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};
module.exports = { createTimetable, modifyTimetable, getTimetable, deleteTimeTable }