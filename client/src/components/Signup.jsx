import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import AuthCard from "../components/AuthCard";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5050/api/v1/signup", {
        username: name,
        password: password,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Username
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
            placeholder="Create a password"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
            placeholder="Confirm your password"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
            I agree to the{" "}
            <Link to="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
};

export default Signup;
