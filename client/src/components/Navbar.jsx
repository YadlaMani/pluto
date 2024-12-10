import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa6";

const Navbar = () => {
  const token = localStorage.getItem("jwt");

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
            Pluto
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/account"
            className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
          >
            Account
          </Link>
          <Link
            to="/airdrop"
            className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
          >
            Airdrop
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-300 hover:text-blue-400 transition-colors font-medium"
          >
            <FaGithubAlt className="w-5 h-5" />
            <span>Github</span>
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-red-400 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
