

const  verifyNFC = (req, res, next) => {
    try {
        const nfcVerify = req.headers["x-verifynfc"];
        if (nfcVerify===process.env.NFC_VERIFY_TOKEN) {
            return next();
        }
        return res.status(401).send({success:false, message:"Unauthorized nfc token"})
    } catch (error) {
        return res.status(500).send({ success: false, message: err.message });
    }
}

module.exports = verifyNFC;