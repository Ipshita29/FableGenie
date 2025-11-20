import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookOpen, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";

import Login from "../assets/login.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      const { token, _id, name, email } = response.data;
      login({ _id, name, email }, token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      localStorage.clear();
      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-pink-50 text-gray-900">

  {/* LEFT PANEL */}
  <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-10 bg-pink-100 relative overflow-hidden border-r border-pink-200">

    <div
      className="absolute inset-0 bg-cover bg-center opacity-80"
      style={{ backgroundImage: `url(${Login})` }}
    />
  </div>

  {/* RIGHT PANEL */}
  <div className="flex items-center justify-center w-full lg:w-1/2 p-6">
    <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-lg border border-pink-100">

      <div className="flex flex-col items-center mb-8">
        <BookOpen className="w-10 h-10 text-pink-600 mb-3" />
        <h2 className="text-3xl font-bold text-gray-900">Log in to your Account</h2>
        <p className="text-gray-600 text-sm">We’re happy to see you again.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-11 px-3 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-11 px-3 py-2 pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 h-11 rounded-xl shadow-lg shadow-pink-200/50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-8">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-pink-600 font-semibold hover:text-pink-700">
          Sign Up
        </Link>
      </p>

    </div>
  </div>
</div>

  );
};

export default LoginPage;
