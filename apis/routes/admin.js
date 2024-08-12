const express = require("express");
const router = express.Router();
const AdminController = require("../controller/admin")
const UserAuth = require("../controller/user")
const check_auth = require("../middlewares/checkAuth");




router.put("/order", check_auth.adminAuth, AdminController.changeOrder);
router.get("/orders", check_auth.adminAuth, AdminController.orders);
router.get("/order/:id", check_auth.adminAuth, UserAuth.order);
router.post("/addUser", check_auth.adminAuth, AdminController.addUser);
router.get("/users", check_auth.adminAuth, AdminController.users);
router.delete("/user/:id", check_auth.adminAuth, AdminController.delUser);





module.exports = router
