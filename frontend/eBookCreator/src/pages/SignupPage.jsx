import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookOpen, UserPlus, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";

import Signup from "../assets/Signup.png";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      const { token } = response.data;

      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });

      login(profileResponse.data, token);
      toast.success("Account Created Successfully!");
      navigate('/');
    } catch (error) {
      localStorage.clear();
      toast.error(error.response?.data?.message || "Failed to signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-white to-pink-50 text-gray-900">

    {/* LEFT PANEL (FORM) */}
    <div className="flex items-center justify-center w-full lg:w-1/2 p-6">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-lg border border-pink-100">
        <div className="flex flex-col items-center mb-8">
          <BookOpen className="w-10 h-10 text-pink-600 mb-3" />
          <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-gray-600 text-sm">It only takes a minute.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-11 px-3 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white text-gray-900"
              />
            </div>
          </div>

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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-pink-200/50 transition"
          >
            {isLoading ? (
              <>
                <UserPlus className="w-4 h-4 mr-2 animate-spin" /> Signing up...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 font-semibold hover:text-pink-700">
            Login
          </Link>
        </p>
      </div>
    </div>

    {/* RIGHT PANEL (IMAGE) */}
    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-10 bg-pink-100 relative overflow-hidden border-l border-pink-200">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${Signup})` }}
      />
    </div>

  </div>
);

};

export default SignupPage;
