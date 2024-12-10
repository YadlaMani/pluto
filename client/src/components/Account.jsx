import React, { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "react-modal";
import { FaRegCheckCircle } from "react-icons/fa";

const Account = () => {
  const jwt = localStorage.getItem("jwt");
  const [user, setUser] = useState(null);
  const [solBalance, setSolBalance] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [signature, setSignature] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/v1/me`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setUser(response.data.user);
      setTransactions(response.data.user.transactionSignatures || []);
    } catch (error) {
      toast.error("An error occurred while fetching user data");
    }
  };

  const fetchSolanaBalance = async (publicKey) => {
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const balance = await connection.getBalance(new PublicKey(publicKey));
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      toast.error("Failed to fetch Solana balance");
    }
  };

  const sendSol = async () => {
    if (!recipientAddress || !sendAmount) {
      toast.error(
        "Please provide both a recipient address and a valid SOL amount."
      );
      return;
    }
    setIsSending(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const fromPubkey = new PublicKey(user.publicKey);
      const toPubkey = new PublicKey(recipientAddress);
      const lamports = parseFloat(sendAmount) * LAMPORTS_PER_SOL;

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = fromPubkey;

      const serializedTx = tx.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}api/v1/txn/sign`,
        {
          message: serializedTx,
          retry: false,
          user: user,
        }
      );

      toast.success("Transaction Sent Successfully!");
      fetchSolanaBalance(user.publicKey);
      setSignature(res.data.signature);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!jwt) {
      window.location.href = "/login";
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.publicKey) {
      fetchSolanaBalance(user.publicKey);
    }
  }, [user]);

  const closeModal = () => setIsModalOpen(false);

  const handleTransactionClick = (transactionSignature) => {
    window.open(
      `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`,
      "_blank"
    );
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col md:grid md:grid-cols-2 gap-6 px-6 py-8">
      <div className="bg-gray-800/60 border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Account Details</h2>
        {user ? (
          <>
            <p className="text-gray-400 mb-2">
              <span className="font-medium text-gray-300">Username:</span>{" "}
              {user.username || "Unknown"}
            </p>
            <p className="text-gray-400 mb-2 break-words">
              <span className="font-medium text-gray-300">Public Key:</span>{" "}
              {user.publicKey}
            </p>
            <p className="text-gray-400 mb-2">
              <span className="font-medium text-gray-300">SOL Balance:</span>{" "}
              {solBalance} SOL
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-gray-300">Account Type:</span>{" "}
              {user.accountType || "Standard"}
            </p>
          </>
        ) : (
          <p>Loading account details...</p>
        )}
      </div>

      <div className="bg-gray-800/60 border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Send SOL</h2>
        <p className="text-gray-400 mb-6">
          Enter a recipient public key and the amount of SOL to send.
        </p>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter recipient public key"
            className="w-full px-4 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:ring focus:ring-blue-600 focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Amount (SOL)
          </label>
          <input
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            placeholder="Enter amount to send"
            className="w-full px-4 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:ring focus:ring-blue-600 focus:border-blue-500"
          />
        </div>
        <button
          onClick={sendSol}
          disabled={isSending}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
            isSending
              ? "bg-blue-500 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {isSending ? "Sending..." : "Send SOL"}
        </button>
      </div>

      <div className="col-span-2 mt-8">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((transactionSignature, index) => (
            <div
              key={index}
              className="bg-gray-800/60 border border-gray-700 rounded-lg shadow-lg p-6 mb-4 cursor-pointer"
              onClick={() => handleTransactionClick(transactionSignature)}
            >
              <p className="text-gray-400 mb-2">
                <span className="font-medium text-gray-300">Transaction</span>:{" "}
                {transactionSignature}
              </p>
              <p className="text-gray-400">
                <button className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-blue-500 hover:text-red-300 transition-colors border border-red-400 rounded-lg">
                  <span className="font-medium text-gray-300">
                    View on Solana Explorer
                  </span>
                </button>
              </p>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="text-center">
          <FaRegCheckCircle size={40} className="text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Transaction Successful!
          </h3>
          <p className="text-gray-300 mb-6">
            Your transaction has been successfully sent. You can view the
            details on Solana Explorer.
          </p>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-300"
          >
            View on Solana Explorer
          </a>
          <div className="mt-4">
            <button
              onClick={closeModal}
              className="px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Account;
