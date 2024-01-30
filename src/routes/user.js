import express from "express";
const router = express.Router();
import * as userController from "../controller/user.js";
import verifyToken from "../middlewares/auth.js";

router.get("/", userController.getUsers);
router.get("/:username", userController.getUserByUsername);
router.post("/", userController.postUser);
router.post("/login", userController.loginUser);
router.put("/:username", userController.updateUser);
router.delete("/:username", userController.deleteUser);
router.delete("/delete/all", userController.deleteAllUsers);
router.get("/profile/getDetails",verifyToken, userController.getUserProfile);
router.put("/profile/updateDetails",verifyToken, userController.updateUserProfile);

export default router;
