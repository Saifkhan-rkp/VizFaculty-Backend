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

function timeDifference(start, end) {
    try {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        // var minutes = Math.floor(diff / 1000 / 60);
    
        // If using time pickers with 24 hours format, add the below line get exact hours
        if (hours < 0)
            hours = hours + 24;
    
        return hours;
    } catch (error) {
        console.log(error);
    }
}
module.exports = { addUser, rolesAndRef, timeDifference }