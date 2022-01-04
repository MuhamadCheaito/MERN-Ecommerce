const express = require("express");

const { getAllProducts, createProduct, 
        updateProduct, deleteProduct, 
        getProductDetails } = require("../controllers/productController");

const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Products Routes 
router.route("/products")
      .get(isAuthenticatedUser, authorizeRoles("admin"), getAllProducts);

router.route("/product/new")
      .post(isAuthenticatedUser,authorizeRoles("admin"), createProduct);

router.route("/product/:id")
      .put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct)
      .delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProduct)
      .get(getProductDetails);



module.exports = router;