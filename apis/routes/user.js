const express = require("express");
const router = express.Router();
const AuthController = require("../controller/authorization");
const UserController = require("../controller/user")
const check_auth = require("../middlewares/checkAuth")



const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 3 }
});





// SIGN UP
router.post("/signup", upload.array("image"), AuthController.SignUp);
router.get("/verify", AuthController.Verify);
router.post("/login", AuthController.Login);
router.post("/google", AuthController.google_facebook);
router.post("/reset-password", UserController.resetPassword);
router.post("/changePassword", UserController.changePassword);
////////////////////////////////////////////////////////////////
router.get("/", check_auth.userAuth, UserController.homePage)
router.get("/homeOrders", check_auth.userAuth, UserController.homeOrders)
router.get("/orders", check_auth.userAuth, UserController.orders)
router.get("/order/:id", check_auth.userAuth, UserController.order)
router.post("/order",check_auth.userAuth, UserController.createOrder)
router.put("/order/:id", check_auth.userAuth, UserController.editOrder)
router.post("/address", check_auth.userAuth, UserController.addLocation)
//router.delete("/address/:id", check_auth.userAuth, UserController.removeLocation)
router.get("/address/:id", check_auth.userAuth, UserController.getLocation)
router.get("/addresses/:type", check_auth.userAuth, UserController.getLocations)
router.get("/driverLocation/:packageID", check_auth.userAuth, UserController.getDriverLocation)
router.put("/rateOrder/", check_auth.userAuth, UserController.rateOrder)



module.exports = router
