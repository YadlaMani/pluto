import React from "react";
import { FaRocket, FaShieldAlt, FaRegSmile } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen  text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
          Welcome to Pluto
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-600 text-center max-w-2xl">
          A Web3 wallet built for everyone. No technical skills required. We
          handle your private keys securely, so you can explore Web3
          effortlessly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 max-w-4xl">
          <div className="flex flex-col items-center p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <FaRocket className="text-4xl text-blue-500 mb-4" />
            <h3 className="font-semibold text-xl text-gray-800 mb-2">
              Fast & Easy
            </h3>
            <p className="text-gray-600 text-center">
              Start using Web3 in minutes. We take care of the hard parts so you
              don’t have to.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <FaShieldAlt className="text-4xl text-blue-500 mb-4" />
            <h3 className="font-semibold text-xl text-gray-800 mb-2">Secure</h3>
            <p className="text-gray-600 text-center">
              Your keys, your assets. Managed with state-of-the-art security
              measures.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <FaRegSmile className="text-4xl text-blue-500 mb-4" />
            <h3 className="font-semibold text-xl text-gray-800 mb-2">
              User-Friendly
            </h3>
            <p className="text-gray-600 text-center">
              No complex jargon or setup. Designed for everyone.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition duration-300"
          >
            Get Started
          </Link>
          <p className="mt-4 text-white text-sm">
            Coming soon: More features to explore!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
