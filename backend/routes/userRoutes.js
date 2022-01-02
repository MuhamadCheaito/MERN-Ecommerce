const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logoutUser, getAllUsers} = require("../controllers/userController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/users").get(isAuthenticatedUser,authorizeRoles("admin"), getAllUsers);

module.exports = router;