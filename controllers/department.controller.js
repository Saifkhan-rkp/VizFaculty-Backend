const { default: mongoose } = require("mongoose");
const { User, Department } = require("../models");
const { addUser } = require("../configs/helpers");


const addDept = async (deptData) =>{
    try {
        const dept = new Department(deptData);
        console.log("here 5");
        // let ret;
        await dept.save();
        const modifyRole =await User.updateOne({_id:deptData.deptHeadId},{role:"deptHead"});
        return { success: true, org, isRoleUpdated: modifyRole.modifiedCount>0 };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message }
    }
};

const createDept = async (req, res, next) => {
    try {
        console.log("here..");
        const { deptName, code, email } = req.body;
        const userAlive =await User.findOne({ email });
        console.log("here 2");
        if (userAlive) {
            console.log("here 3");
            const result = await addDept({
                deptName,
                code,
                deptHeadId: new mongoose.Types.ObjectId(userAlive._id)
            });
            if(result.success){
                res.status(201).send({ success: true, message: "Deparment Added to your Organization/Instatution Successfully!", ...result });
            }else if(!result.success){
                result.statusCode = 500;
                next(result);
            }
        } else {
            addUser({ intro: `You are invited for role ${deptName} Departmet Head, please complete registration process.`, email, })
                .then(async user => {
                    const result =await addDept({
                        deptName,
                        code,
                        auth: user.id
                    });
                    if(result.success){
                        res.status(201).send({ success: true, message: "Deparment Added to your Organization/Instatution Successfully!", ...result });
                    }else if(!result.success){
                        result.statusCode = 500;
                        next(result);
                    }  

                }).catch(err => next(err))
        }
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const getDept = async(req,res,next) =>{
    try {
        const { deptId } = req.params;
        if (!mongoose.isValidObjectId(deptId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const dept = await Department.findById(deptId,{_id:0});
        if(!dept)
            return next({message:"Not Found/Not Exists"});
        res.status(201).send({success:true, message:"found", dept });
    } catch (error) {
        next.statusCode = 500;
        next(error);
    }
};

const modifyDept = async (req, res, next) => {
    try {
        const { deptId } = req.params;
        const toModify = req.body;
        if (!mongoose.isValidObjectId(deptId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const isDeptModified = await Department.updateOne({_id:deptId}, {$set:toModify, $currentDate:{updatedAt:true}});
        if(isDeptModified.modifiedCount>0)
            return res.status(201).send({success:true, message:"Department Updated Successfully!"});
        res.send({success:false, message:"Unable to update Department"});
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}; 

module.exports = { createDept, getDept, modifyDept };