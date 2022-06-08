import { Router } from "express";
import { protect } from "../../util/auth";
import { Email } from "../../util/sendGrid";
import {
  addEmail,
  updateEmail,
  suspendEmail,
  getEmails,
  getEmail,
} from "./emailTemplate_controller";

const router = Router();

router.route("/add_Email").post(protect, addEmail);
router.route("/update_Email/:id").patch(protect, updateEmail);
router.route("/suspend_Email/:id").post(protect, suspendEmail);
router.route("/view_Email/:id").get(getEmail);
router.route("/view_Email").get(getEmails, Email);

export default router;
