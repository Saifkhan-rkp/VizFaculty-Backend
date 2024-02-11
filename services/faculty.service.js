const { Faculty } = require("../models")



module.exports = {
    async getFacultyDepartment(fId){
        const result = await Faculty.findById(fId).select("inDepartment");
        return result; 
    },

}