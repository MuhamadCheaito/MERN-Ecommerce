const express = require("express");

const router = express.Router();

const {registerUser, loginUser, logoutUser, 
      getAllUsers, forgotPassword, resetPassword, 
      getUserDetails, updatePassword, updateProfile, getUser} = require("../controllers/userController");

const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

router.route("/admin/users")
      .get(isAuthenticatedUser,authorizeRoles("admin"), getAllUsers);

router.route("/admin/users/:id")
      .get(isAuthenticatedUser,authorizeRoles("admin"), getUser);

router.route("/profile")
      .get(isAuthenticatedUser,getUserDetails);

router.route("/password/update")
      .put(isAuthenticatedUser,updatePassword);

router.route("/profile/update")
      .put(isAuthenticatedUser,updateProfile);

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