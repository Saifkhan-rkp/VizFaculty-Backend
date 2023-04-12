const { register, login, verify, resetPassword, forgotPassword } = require('./auth/auth');
const { getOrgById, createOrg} = require('./org.controller');

module.exports = {
    register, login, verify, resetPassword, forgotPassword,
    getOrgById, createOrg,
}