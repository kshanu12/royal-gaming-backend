import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid";
import { setUser } from "../service/auth.js";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function getUsers(req, res) {
  console.log("inside getUsers API");
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (e) {
    res.status(200).json({ error: e });
  }
}

export async function getUserByUsername(req, res) {
  console.log("inside getUserByUsername API");
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user." });
  }
}

export async function postUser(req, res) {
  console.log("inside postUser API");

  try {
    var username = generateString(8);
    var password = generateString(10);

    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        username,
        password,
      },
    });
    res
      .status(201)
      .json({ username: newUser.username, password: newUser.password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user." });
  }
}

export async function loginUser(req, res) {
  console.log("inside loginUser API");

  try {
    const { username, password } = req.body;
    let user;
    if (username === "royal-admin" && password === "royal#gaming!123") {
      user = { username: username };
      const token = setUser(user);
      res.status(201).json({
        token: token.token,
        tokenExpiry: token.tokenExpiry,
        isAdmin: true,
      });
    } else {
      user = await prisma.user.findFirst({
        where: { username, password },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const token = setUser(user);
      res.status(201).json({
        token: token.token,
        tokenExpiry: token.tokenExpiry,
        isAdmin: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user." });
  }
}

export async function updateUser(req, res) {
  console.log("inside updateUser API");

  try {
    const { username } = req.params;
    console.log(username);
    const { password, email, coins, transactionId } = req.body;
    console.log(password, " ", email, " ", coins);

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        password: password || undefined,
        email: email || undefined,
        coins: coins || undefined,
      },
    });

    if (transactionId) {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          processed: true,
        },
      });
    }

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user." });
  }
}

export async function updateUserProfile(req, res) {
  console.log("inside updateUserProfile API");

  try {
    const username = req.user.username;
    console.log(username);
    const { password, email, coins } = req.body;
    console.log(password, " ", email, " ", coins);

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        password: password || undefined,
        email: email || undefined,
        coins: coins || undefined,
      },
    });

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user." });
  }
}

export async function deleteUser(req, res) {
  console.log("inside deleteUser API");

  try {
    const { username } = req.params;

    const deletedUser = await prisma.user.delete({
      where: { username },
    });

    res.status(204).send({ deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user." });
  }
}

export async function deleteAllUsers(req, res) {
  console.log("inside deleteAllUsers API");

  try {
    const deletedUsers = await prisma.user.deleteMany();
    res.status(204).send({ deletedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete all users." });
  }
}

export async function getUserProfile(req, res) {
  console.log("inside getUserProfile API");

  try {
    const username = req.user.username;

    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res
      .status(200)
      .json({ username: user.username, email: user.email, coins: user.coins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user." });
  }
}
