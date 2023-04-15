const { register, login, verify, resetPassword, forgotPassword } = require('./auth/auth');
const { getDept, createDept, modifyDept, deleteDept } = require('./department.controller');
const { getOrgById, createOrg} = require('./org.controller');
const {getTimetable, createTimetable, modifyTimetable, deleteTimeTable} = require('./timetable.controller');

module.exports = {
    register, login, verify, resetPassword, forgotPassword,
    getOrgById, createOrg,
    getTimetable, createTimetable, modifyTimetable, deleteTimeTable,
    getDept, createDept, modifyDept, deleteDept 
}