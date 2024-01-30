import express from "express";
const router = express.Router();
import * as bettingController from "../controller/betting.js";
import verifyToken from "../middlewares/auth.js";

router.post("/", bettingController.getCoinsWon);

export default router;
