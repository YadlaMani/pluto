import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { z } from "zod";
import usermodel from "./models.js";
import { Keypair, Transaction, Connection } from "@solana/web3.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import bs58 from "bs58";
const app = express();
app.use(cors());
app.listen(5050, () => {
  console.log("Listening on port 5050");
});
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection failed:", err));
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/5pNLaxwfuYHHlgvFr1-EqCk1V4kzvOTw"
);
app.post("/api/v1/signup", async (req, res) => {
  try {
    const { username, password } = signupSchema.parse(req.body);
    const existingUser = await usermodel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const keypair = new Keypair();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usermodel.create({
      username,
      password: hashedPassword,
      privateKey: keypair.secretKey.toString(),
      publicKey: keypair.publicKey.toString(),
    });
    res.status(201).json({
      message: "User signed up successfully",
      publicKey: newUser.publicKey,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await usermodel.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);

  res.json({
    message: "Sign in successfull",
    jwt: token,
  });
});

app.post("/api/v1/txn/sign", async (req, res) => {
  try {
    const serializedTransaction = req.body.message;
    const secretKeyString = req.body.user.privateKey;
    const secretKeyArray = secretKeyString.split(",").map(Number);
    const secretKeyUint8Array = new Uint8Array(secretKeyArray);
    const keypair = Keypair.fromSecretKey(secretKeyUint8Array);

    const tx = Transaction.from(Buffer.from(serializedTransaction, "base64"));
    tx.sign(keypair);

    const signature = await connection.sendTransaction(tx, [keypair]);
    const user = await usermodel.findOne({
      publicKey: req.body.user.publicKey,
    });
    if (user) {
      user.transactionSignatures.push(signature);
      await user.save();
    }

    res.json({
      message: "Transaction signed successfully",
      signature: signature,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error signing transaction", error: err.message });
  }
});
app.get("/api/v1/publicKey", (req, res) => {
  const { jwt } = req.headers;
  const username = jwt.verify(jwt, process.env.JWT_SECRET);
  console.log(username);
  res.json({
    message: "All good",
  });
});
app.get("/api/v1/txn/:id", (req, res) => {
  res.json({
    message: "Get Transaction",
  });
});
app.get("/api/v1/me", async (req, res) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findOne({ username: decoded.username });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User retrieved successfully",
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});
