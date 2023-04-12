const { User } = require("../models");
const sendMail = require("./sendMail");

const addUser = ({ intro, message, ...userDetail }) => {
    return new Promise(async (res, rej) => {
        try {
            console.log("here 6");
            const user = new User({ ...userDetail, remoteAdd: true, verified: true });
            await user.save();
            console.log("here 8");
            const token = "some token";
            const mailStatus = await sendMail({ email: user.email, type: "addUser", token, intro })
            console.log(mailStatus);
            res({ success: true, message: "User Added Successfully", id: user._id });

        } catch (error) {
            error.statusCode = 500;
            rej(error)
        }
    })
}

module.exports = { addUser }