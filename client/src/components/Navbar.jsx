import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

const Navbar = () => {
  const token = localStorage.getItem("jwt");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              Pluto
            </span>
          </Link>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/account"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Account
            </Link>
            <Link
              to="/airdrop"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Airdrop
            </Link>
            <a
              href="https://github.com/YadlaMani/pluto"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium group"
            >
              <FaGithub className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-red-400 rounded-lg hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300"
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 absolute left-0 right-0 top-16 border-b border-gray-800 shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <Link
                to="/"
                className="block text-gray-300 hover:text-white py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/account"
                className="block text-gray-300 hover:text-white py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Account
              </Link>
              <Link
                to="/airdrop"
                className="block text-gray-300 hover:text-white py-2 transition-colors"
                onClick={toggleMobileMenu}
              >
                Airdrop
              </Link>
              <a
                href="https://github.com/YadlaMani/pluto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white py-2 transition-colors"
              >
                <FaGithub className="w-5 h-5" />
                <span>GitHub</span>
              </a>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                {token ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-red-400 rounded-lg"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow"
                      onClick={toggleMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
