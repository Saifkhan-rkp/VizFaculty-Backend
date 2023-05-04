const jwt = require("jsonwebtoken");
const { User } = require("../models");
const sendMail = require("./sendMail");

const addUser = ({ intro, message, ...userDetail }) => {
    return new Promise(async (res, rej) => {
        try {
            const user = new User({ ...userDetail, remoteAdd: true, verified: true });
            await user.save();   
            const token = jwt.sign({ email: user.email },
                    process.env.ADD_USER_SECRET,
                    {
                        expiresIn: "7d",
                    }
                );         
            const mailStatus = await sendMail({ email: user.email, type: "addUser", token, intro })
            console.log(mailStatus);
            res({ success: true, message: "User Added Successfully", id: user._id });

        } catch (error) {
            error.statusCode = 500;
            rej(error)
        }
    })
}
const rolesAndRef = {
    faculty: { role : "faculty", ref:"faculties" },
    deptHead: {role:"deptHead", ref:"departments"},
    adminDept: {role:"adminDept", ref:"organizations"} 
}

module.exports = { addUser, rolesAndRef }