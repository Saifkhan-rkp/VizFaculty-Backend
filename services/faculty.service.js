const { Faculty } = require("../models")



module.exports = {
    async getFacultyDepartment(fId){
        const result = await Faculty.findById(fId).select("inDepartment");
        return result; 
    },
    async updateFaculty(fId, data){
       const result = await Faculty.updateOne(
            { _id: fId },
            { $set: data, $currentDate: { updatedAt: true } }
        );
        return result;
    },
}