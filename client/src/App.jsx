import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  Connection,
  Transaction,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import Login from "./components/Login.jsx";
import Signup from "./components/SignUp.jsx";
import Account from "./components/Account.jsx";
import Airdrop from "./components/Airdrop.jsx";

function App() {
  const [count, setCount] = useState(0);
  async function sendSol() {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(
          "64xKkdE93fvWnqy5U1qj3zTTAuaR36wGYR8uQC4cd61F"
        ),
        toPubkey: new PublicKey("2Bn6FVMrcg2Uob9AwpGTmYzHfByZoCJDNyu14GLCCLF1"),
        lamports: 1 * LAMPORTS_PER_SOL,
      })
    );
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = new PublicKey("64xKkdE93fvWnqy5U1qj3zTTAuaR36wGYR8uQC4cd61F");

    //convert to bytes
    const serialtx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    const res = await axios.post("http://localhost:5050/api/v1/txn/sign", {
      message: serialtx,
      retry: false,
    });
    console.log(res.data.message);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 px-4 pt-4">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path="/airdrop" element={<Airdrop />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
