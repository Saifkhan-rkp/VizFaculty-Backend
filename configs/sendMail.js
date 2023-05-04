const Mailgen = require("mailgen");
const nodemailer = require('nodemailer');

// Mailgen
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'VizFaculty',
        link: 'https://vizfaculty.com/',
        // Optional logo
        // logo: 'https://VizFacultys.com/assets/logo/Color-REMO.png',
        // logoHeight:'60px',
    }
});

const emailTemps = {
    forgetPassword: {
        body: {
            name: '',
            intro: 'You have received this email because a password reset request for your account was received.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#DC4D2F',
                    text: 'Reset your password',
                    link: ''
                }
            },
            outro: 'If you did not request a password reset, no further action is required on your part.'
        }
    },
    verifyEmail: {
        body: {
            name: '',
            intro: 'Welcome to VizFaculty! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with VizFaulty, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your Email',
                    link: ''
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    },
    addUserEmail: {
        body: {
            name: 'Dear User',
            intro: '',
            action: {
                instructions: 'To get started with VizFaulty, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Complete Process',
                    link: ''
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    },
    notifyRole: {
        body: {
            name: '',
            intro: 'Welcome to VizFaculty! We\'re very excited to have you on board.',
            action: {
                instructions: 'To checkout your role in with VizFaulty, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Explore VizFaculty',
                    link: ''
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
};

const sendMail = async ({ name, email, token, type = "resetPass", intro, role }) => {
    var emailBody, subject;
    const transporter = nodemailer.createTransport({
        service: 'gamil',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODE_EMAIL,
            pass: process.env.NODE_EMAIL_PASS
        }
    });
    if (type === "verify") {
        subject = 'Email verifiaction';
        emailTemps.verifyEmail.body.name = await name;
        emailTemps.verifyEmail.body.action.button.link = `${process.env.BASE_URL}/auth/verify/${await token}`
        emailBody = await mailGenerator.generate(emailTemps.verifyEmail); //HTML coed template

    } else if(type === "resetPass") {
        subject = 'Reset Password';
        emailTemps.forgetPassword.body.name = await name;
        emailTemps.forgetPassword.body.action.button.link = `${process.env.BASE_URL}/auth/reset-password/${await token}`;
        emailBody = await mailGenerator.generate(emailTemps.forgetPassword); //HTML coed template

    } else if (type === "addUser") {
        subject = "Complete Registeration Proces";
        emailTemps.addUserEmail.body.intro = `Welcome to VizFaculty! ${intro}`;
        emailTemps.addUserEmail.body.action.button.link = `${process.env.BASE_URL}/auth/completeRegister/${await email}/${await token}`;
        emailBody = await mailGenerator.generate(emailTemps.addUserEmail);

    } else if (type === "notifyRole") {
        let yourRole = await role;
        if(yourRole==="faculty") yourRole = "Faculty";
        else if(yourRole==="hod") yourRole ="Department";
        else yourRole = "Adminstration department"
        subject = `Role Assigned : ${yourRole}`;
        emailTemps.notifyRole.body.name = await name;
        emailTemps.notifyRole.body.action.button.link = `${process.env.BASE_URL}/${await role}/dashboard`;
        emailBody = await mailGenerator.generate(emailTemps.notifyRole);
    }

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: emailBody
    };
    return await transporter.sendMail(mailOptions);
    // return { fromTo : resp.envelope,status: resp.response.split(" ",)[2]};
};
module.exports = sendMail;