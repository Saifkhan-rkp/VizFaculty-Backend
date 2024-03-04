const jwt = require("jsonwebtoken");

const authM = (req, res, next) => {
  try {
    const token = req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, (process.env.ADD_USER_SECRET || "VizFaculty is Calculating"), (err, user) => {
        if (err) {
          return res.status(401).send({ success: false, message: "Token is not valid!" });
        }
        req.user = user;
        next();
      });
    }
    else {
      return res.status(401).send({ success: false, message: "You are not authenticated!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err.message });
  }
}
module.exports = authM;