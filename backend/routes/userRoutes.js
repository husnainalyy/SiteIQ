const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authenticateUserByClerkId = require("../middlewares/authenticateUserByClerkId.js");

// Apply middleware only to specific routes
router.use(authenticateUserByClerkId);

router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);
router.delete("/", userController.deleteUser);
router.get("/seo-reports", userController.getUserSeoReports);
router.get("/subscription", userController.getUserSubscription);

module.exports = router;
