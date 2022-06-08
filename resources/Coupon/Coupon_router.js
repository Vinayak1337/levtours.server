import { Router } from "express";
import {
  addCoupon,
  getCoupon,
  getCoupons,
  deleteCoupon,
  editCoupon,
  applyCoupon,
} from "./Coupon_controller";
import { protect } from "../../util/auth.js";

const router = Router();

router.route("/").get(getCoupons);
router
  .route("/:id")
  .get(getCoupon)
  .delete(protect, deleteCoupon)
  .patch(protect, editCoupon);
router.route("/add").post(protect, addCoupon);
router.route("/applyCoupon").post(protect, applyCoupon);

export default router;
