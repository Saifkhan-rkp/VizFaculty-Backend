
const dbURI = process.env.MONGODB_URI ;
const mongoose = require("mongoose");

mongoose.connect(dbURI)
  .then(() => console.log("Database Connection Successful!"))
  .catch((err) => console.log(err));
