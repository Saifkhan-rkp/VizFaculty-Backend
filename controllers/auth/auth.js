const CryptoJS = require('crypto-js');
// const createError = require('http-errors');
const jwt = require('jsonwebtoken');
// const { readFileSync, existsSync } = require('fs');
const { User } = require('../../models');
const sendMail = require('../../configs/sendMail');
const { default: mongoose } = require('mongoose');

const SECRET_KEY = process.env.ADD_USER_SECRET || "VizFaculty is Calculating";
// console.log(SECRET_KEY);
const register = async (req, res, next) => {
    try {
        const userAlive = await User.findOne({ email: req.body.email });
        if (userAlive) {
            return res.send({ success: false, message: "User Already Exists..!" });
        }
        const hashedPass = CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString();
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            role: req.body.role || "normal"
        });
        user.save().then(async (result) => {
            console.log(result);
            // const token = jwt.sign({ email: userData.email },
            //     SECRET_KEY,
            //     {
            //         expiresIn: "3h",
            //     }
            // );
            // const hashedToken = CryptoJS.AES.encrypt(token, process.env.RESETPASS_SECRET_KEY || "VizFaculty is calculating").toString();
            // // console.log("http://localhost:4000/reset-password/",atob(token));
            // const mailStatus = await sendMail({ name: result.name, token: btoa(token), email: result.email, type: "verify" });
            //     if (mailStatus.accepted.includes(userData.email))
            //     res.send({ success: true, message: `Password reset email sent to ${userData.email}`, email: userData.email });
            // else if (mailStatus.rejected.includes(userData.email))
            //     res.send({ success: false, message: "Unable to send password reset email..!" })

            res.status(201).send({ success: true, message: `Registered successfully..!`, user: { name: result.name, email: result.email } });
        }).catch((err) => {
            next({ statusCode: 500, message: "Internal Server Error" });
        });
        // console.log(hashedPass);
    } catch (error) {
        console.log(error);
        error.statusCode = 400;
        next(error);
    }
    // res.send({message : req.body.name+" zala satyanash"});
};
const login = async (req, res, next) => {
    try {
        // const  = req.body;
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            next({ statusCode: 404, message: "Mismatched email or password..!" });
        const bytes = CryptoJS.AES.decrypt(
            user.password,
            SECRET_KEY
        );
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(401).send({ success: false, message: "Mismatched email or password..!" });
        }
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role, roleId: user?.roleId },
            SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );
        const { password, _id, model_type, roleId, ...info } = user._doc;
        res.status(200).send({ user: { ...info }, success: true, message: "Logged in successfully..!", token: accessToken });

    } catch (error) {
        next({ statusCode: 500, message: error.message });
    }
};
const verify = (req, res, next) => {
    res.redirect("http://localhost:3000/auth/login")
};
const forgotPassword = async (req, res, next) => {
    try {
        const email = await req.body.email;
        console.log(email);
        const userData = await User.findOne({ email })
        // console.log(!userData);
        if (!userData) {
            return res.status(404).send({
                success: false,
                message: 'This email is not registered..!'
            })
        }
        const token = jwt.sign({ email: userData.email },
            SECRET_KEY,
            {
                expiresIn: "2h",
            }
        );
        const hashedToken = CryptoJS.AES.encrypt(token, process.env.RESETPASS_SECRET_KEY || "VizFaculty is calculating").toString();
        // console.log("http://localhost:4000/reset-password/",atob(token));
        const mailStatus = await sendMail({ name: userData.name, token: btoa(token), email: userData.email, type: "resetPass" });
        console.log(`http://localhost:4000/api/reset-password/${btoa(hashedToken)}`);
        if (mailStatus.accepted.includes(userData.email))
            res.send({ success: true, message: `Password reset email sent to ${userData.email}`, email: userData.email });
        else if (mailStatus.rejected.includes(userData.email))
            res.status(503).send({ success: false, message: "Unable to send password reset email..!" })
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};
const resetPassword = (req, res, next) => {
    try {
        const { token } = req.params;
        const bytes = CryptoJS.AES.decrypt(
            atob(token),
            process.env.RESETPASS_SECRET_KEY || "VizFaculty is calculating"
        );
        const originalToken = bytes.toString(CryptoJS.enc.Utf8);
        jwt.verify(originalToken, SECRET_KEY, async (err, user) => {
            if (err) {
                return next({ statusCode: 401, message: "Link is not valid!" });
            }
            const hashedPass = CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString();
            const isUpadate = await User.updateOne({ email: user.email }, { password: hashedPass });
            if (isUpadate.modifiedCount > 0) {
                return res.status(201).send({ success: true, message: "Password Updated Successfully..!" });
            }
            res.send({ success: false, message: "there is some problem while changing password..!" });
        });
        // console.log(verify);
        // res.send(verify);
    } catch (error) {
        console.log(error);
        next({ message: error.message, statusCode: 500 });
    }
};

const completeRegister = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password, name } = req.body;
        jwt.verify(token, process.env.ADD_USER_SECRET, async (err, user) => {
            if (err) {
                return next({ statusCode: 401, message: "Link is not valid!" });
            }
            const hashedPass = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
            const isRegisterComplete = await User.findOneAndUpdate({ email: user.email }, { name, password: hashedPass }, { returnDocument: 'after' });
            if (isRegisterComplete.modifiedCount > 0)
                return res.status(201).send({ success: true, message: "Register Complete Successfully..!" });

            res.send({ success: false, message: "there is some problem while Registering User..!" });
        })
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

const getUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!mongoose.isValidObjectId(userId))
            return next({ message: "invalid refrence for request", statusCode: 400 });
        const user = await User.findOne({_id:userId});
        if(!user)
            return next({statusCode:404, message:"user not found / maybe user deleted"});
        const {name, email, role, roleId } = user; 
        res.send({success:true, user:{name, email, role, roleId}});
    } catch (error) {
        error.statusCode = 500;
        next(error)
    }
};

module.exports = { register, login, verify, forgotPassword, resetPassword, completeRegister, getUser };