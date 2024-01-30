import express from "express";
const router = express.Router();
import * as transactionController from "../controller/transaction.js";
import verifyToken from "../middlewares/auth.js";

router.post("/", transactionController.addTransaction);
router.post("/user/addTransaction",verifyToken, transactionController.addTransactionByToken);
router.get("/:username", transactionController.getTransactionByUsername);
router.get("/user/getTransaction",verifyToken, transactionController.getTransactionByToken);

export default router;
