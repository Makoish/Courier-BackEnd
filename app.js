const express = require("express");

const app = express();
const mongoose = require("mongoose")
const userRoutes = require("./apis/routes/user")
const driverRoutes = require("./apis/routes/driver")
app.use(express.json());
require("dotenv").config();







app.use("/user", userRoutes);
app.use("/driver", driverRoutes);




mongoose.connect("mongodb+srv://mohamedmohsen96661:yahoome.com@cluster0.mxcow0f.mongodb.net/Node-test?retryWrites=true&w=majority&appName=Cluster0");

mongoose.connection.on("connected", () => {
  console.log("mongodb connection established successfully");
});
mongoose.connection.on("error", () => {
  console.log("mongodb connection Failed");
  mongoose.connect(process.env.NGO_URL_HOSTED);
});



module.exports = app