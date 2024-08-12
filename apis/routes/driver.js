const express = require("express");
const router = express.Router();
const DriverController = require("../controller/driver")
const UserController = require("../controller/user")
const check_auth = require("../middlewares/checkAuth");




router.get("/", check_auth.userAuth, DriverController.homePage)
router.get("/homeOrders", check_auth.userAuth, UserController.homeOrders)
router.get("/orders", check_auth.userAuth, UserController.orders)
router.get("/order/:id", check_auth.userAuth, UserController.order)
router.put("/order/changeStatus", check_auth.userAuth, DriverController.changeStatus)
router.get("/salary", check_auth.userAuth, DriverController.salary )




module.exports = router
