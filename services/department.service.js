const { Department } = require("../models")


module.exports = {
    async getDepartmentDetails(deptId){
        const result = await Department.findOne({_id:deptId}).select("rates");
        return result;
    }
}