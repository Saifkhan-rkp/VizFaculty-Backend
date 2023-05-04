const { ContactUs } = require("../models");


const createContactUs = async (req,res,next) =>{
    try {
        const body = req.body;
        const contactUs = new ContactUs(body);
        contactUs.save();
        res.send({success:true, message:"we saved your response, We will reach you ASAP..!"})
    } catch (error) {
        error.statusCode =500;
        next(error)
    }
};

module.exports = {createContactUs}