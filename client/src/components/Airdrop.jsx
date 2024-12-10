import React, { useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "react-toastify";
import axios from "axios";

const Airdrop = () => {
  const [address, setAddress] = useState("");
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropSuccess, setAirdropSuccess] = useState(false);

  const jwt = localStorage.getItem("jwt");

  // Fetch user's public key
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/v1/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setAddress(response.data.user.publicKey);
    } catch (error) {
      toast.error("An error occurred while fetching user data");
    }
  };

  // Handle Airdrop
  const handleAirdrop = async () => {
    if (!address) {
      toast.error("No public key found");
      return;
    }
    setIsAirdropping(true);

    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const publicKey = new PublicKey(address);

      // Request airdrop
      const signature = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      ); // 1 SOL
      await connection.confirmTransaction(signature, "confirmed");

      setAirdropSuccess(true);
      toast.success("Airdrop successful! Check your balance.");
    } catch (error) {
      toast.error("Airdrop failed. Please try again later.");
    } finally {
      setIsAirdropping(false);
    }
  };

  useEffect(() => {
    if (!jwt) {
      window.location.href = "/login";
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-6 py-8">
      <div className="w-full max-w-md bg-gray-800/60 border border-gray-700 rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Request Devnet Airdrop</h1>
        <p className="text-gray-400 mb-6">
          Airdrop some Devnet SOL to your account for testing purposes.
        </p>
        {address ? (
          <div className="text-left mb-6">
            <p className="text-gray-300">
              <span className="font-medium text-blue-400">Public Key:</span>{" "}
              {address}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 mb-6">Fetching your account details...</p>
        )}
        <button
          onClick={handleAirdrop}
          disabled={isAirdropping}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
            isAirdropping
              ? "bg-blue-500 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {isAirdropping ? "Airdropping..." : "Get 1 SOL"}
        </button>
        {airdropSuccess && (
          <p className="mt-4 text-green-400 font-medium">
            Airdrop completed! Check your balance.
          </p>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
