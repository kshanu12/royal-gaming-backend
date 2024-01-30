import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid";

export async function addTransaction(req, res) {
  console.log("inside addTransaction API");
  try {
    console.log(req.body.username);
    if (req.body.username) {
      const username = req.body.username;
      const transaction = await prisma.transaction.create({
        data: {
          id: uuidv4(),
          transactionType: req.body.transactionType,
          coins: req.body.coins,
          processed: true,
          username: req.body.username,
          requestedAt: new Date(),
        },
      });
      console.log(transaction);
      const updatedUser = await prisma.user.update({
        where: { username },
        data: {
          coins: req.body.totalCoins || undefined,
        },
      });
    }
    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(200).json({ error: e });
  }
}

export async function addTransactionByToken(req, res) {
  console.log("inside addTransactionByToken API");
  try {
    const username = req.user.username;
    if (username) {
      const transaction = await prisma.transaction.create({
        data: {
          id: uuidv4(),
          transactionType: req.body.transactionType,
          coins: req.body.coins,
          username: username,
          requestedAt: new Date(),
        },
      });
      console.log(transaction);
      const updatedUser = await prisma.user.update({
        where: { username },
        data: {
          coins: req.body.totalCoins || undefined,
        },
      });
    }
    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(200).json({ error: e });
  }
}

export async function getTransactionByUsername(req, res) {
  console.log("inside getTransactionByUsername API");
  console.log(req.params.username);
  try {
    if (req.params.username) {
      const username = req.params.username;

      const userTransactions = await prisma.transaction.findMany({
        where: {
          username: username,
        },
        orderBy: {
          requestedAt: "desc",
        },
      });

      res.status(200).json({ userTransactions });
    } else {
      console.log("else");
      res
        .status(400)
        .json({ error: "Username not provided in the request body." });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getTransactionByToken(req, res) {
  console.log("inside getTransactionByToken API");
  console.log(req.user.username);
  try {
    const username = req.user.username;
    if (username) {
      const userTransactions = await prisma.transaction.findMany({
        where: {
          username: username,
        },
        orderBy: {
          requestedAt: "desc",
        },
      });

      res.status(200).json({ userTransactions });
    } else {
      console.log("else");
      res
        .status(400)
        .json({ error: "Username not provided in the request body." });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error." });
  }
}
