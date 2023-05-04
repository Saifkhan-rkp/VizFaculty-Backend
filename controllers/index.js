const { getAttendance, submitAttendance } = require('./attendance.controller');
const { register, login, verify, resetPassword, forgotPassword, completeRegister, getUser } = require('./auth/auth');
const { createContactUs } = require('./contactUs.controller');
const { getDept, createDept, modifyDept, deleteDept, getDepartments } = require('./department.controller');
const { getFaculty, createFaculty, modifyFaculty, deleteFaculty, getSingleDaySchedule, getFaculties } = require('./faculty.controller');
const { getOrgById, createOrg} = require('./org.controller');
const {getTimetable, createTimetable, modifyTimetable, deleteTimeTable, getAllTimetables} = require('./timetable.controller');

module.exports = {
    register, login, verify, resetPassword, forgotPassword, completeRegister, getUser,
    getOrgById, createOrg,
    getTimetable, createTimetable, modifyTimetable, deleteTimeTable, getAllTimetables,
    getDept, createDept, modifyDept, deleteDept,
    getFaculty, createFaculty, modifyFaculty, deleteFaculty,
    getSingleDaySchedule, 
    getFaculties,
    getDepartments,
    getAttendance, submitAttendance,
    createContactUs
}