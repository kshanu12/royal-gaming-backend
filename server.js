import { PrismaClient } from "@prisma/client";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const prisma = new PrismaClient();
const app = express();
const server = createServer(app);
import cors from "cors";
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] },
  secure: true,
});
app.use(cors());
app.use(express.json());

import userRouter from "./src/routes/user.js";
app.use("/user", userRouter);

import transactionRouter from "./src/routes/transaction.js";
app.use("/transaction", transactionRouter);

import bettingRouter from "./src/routes/betting.js";
app.use("/betting", bettingRouter);

// app.post("/execute-sql", async (req, res) => {
//   const { query, parameters } = req.body;

//   try {
//     if (!query) {
//       return res
//         .status(400)
//         .json({ error: "Missing 'query' parameter in the request body." });
//     }

//     const result = await prisma.$executeRaw`${query}`(...parameters);

//     res.status(200).json({ data: result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Query execution failed." });
//   }
// });

var total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  userOnline = 0;

io.on("connection", (socket) => {
  console.log("A User Connected");
  userOnline++;
  io.emit("user_online", userOnline);

  socket.emit("refresh_changes", total);

  socket.on("new_game", () => {
    total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  });

  socket.on("generate_result", () => {
    const cardWon = Math.floor(Math.random() * 12 + 0);
    io.emit("card_won", cardWon);
  });

  socket.on("new_bet", (index, newAmount) => {
    total[index] += newAmount;
    console.log("inside new_bet");
    io.emit("refresh_changes", total);
  });

  socket.on("disconnect", () => {
    userOnline--;
    io.emit("user_online", userOnline);
    console.log("A User Disconnected");
  });
});

server.listen(3030, () => {
  console.log("Server is running on http://localhost:3030");
});
