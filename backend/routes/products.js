import {
  getProducts,
  newProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  deleteReview,
  createProductReview,
  getProductReviews,
  getAdminProducts,
  uploadProductImages,
  deleteProductImages,
} from "../controllers/productControllers.js";
import express from "express";
import { isAuthenticatedUser, authorizedRoles } from "../middlewares/auth.js";
import { create } from "domain";
const router = express.Router();

router.route("/products").get(getProducts);
// router.route("/products").get(isAuthenticatedUser, authorizedRoles("admin"), getProducts);
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizedRoles("admin"), newProducts);
  
router
  .route("/admin/products/:id/upload_images")
  .put(isAuthenticatedUser, authorizedRoles("admin"), uploadProductImages);

router
  .route("/admin/products/:id/delete_images")
  .put(isAuthenticatedUser, authorizedRoles("admin"), deleteProductImages);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts);

router.route("/products/:id").get(getProductDetails);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct);
router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .get(isAuthenticatedUser, getProductReviews)
  .put(isAuthenticatedUser, createProductReview);

router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteReview);

export default router;
