const express = require("express");

const router = express.Router();

const {registerUser, loginUser, logoutUser, 
      getAllUsers, forgotPassword, resetPassword} = require("../controllers/userController");

const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

router.route("/users")
      .get(isAuthenticatedUser,authorizeRoles("admin"), getAllUsers);

router.route("/register")
      .post(registerUser);

router.route("/login")
      .post(loginUser);

router.route("/password/forgot")
      .post(forgotPassword);

router.route("/password/reset/:token")
      .put(resetPassword);

router.route("/logout")
      .post(logoutUser);



module.exports = router;