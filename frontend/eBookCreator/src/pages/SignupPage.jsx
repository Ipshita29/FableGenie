import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookOpen, UserPlus, User } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";

import Signup from "../assets/Signup.png";   // ← Correct import

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
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
      navigate('/dashboard');
    } catch (error) {
      localStorage.clear();
      toast.error(error.response?.data?.message || "Failed to signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-950 text-white">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-10 bg-rose-900 relative overflow-hidden shadow-2xl">
        
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${Signup})` }} // ← FIXED
        />

        {/* Pink gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 to-rose-800/80"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <UserPlus className="w-16 h-16 text-pink-300 mb-4 animate-bounce" />
          <h1 className="text-5xl font-extrabold tracking-tight text-pink-200">
            Join Us Today!
          </h1>
          <p className="mt-3 text-pink-100 text-xl font-light">
            Start your journey with creativity.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-6">
        <div className="w-full max-w-md p-10 bg-rose-900 rounded-2xl shadow-2xl border border-rose-700/50">
          
          <div className="flex flex-col items-center mb-8">
            <BookOpen className="w-10 h-10 text-pink-400 mb-3" />
            <h2 className="text-3xl font-bold text-pink-200">Create Your Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField type="text" name="name" placeholder="Full Name" icon={User}
              value={formData.name} onChange={handleChange} required />
            <InputField type="email" name="email" placeholder="Email" icon={Mail}
              value={formData.email} onChange={handleChange} required />
            <InputField type="password" name="password" placeholder="Password" icon={Lock}
              value={formData.password} onChange={handleChange} required />

            <Button type="submit" disabled={isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-500/30 transition-all duration-200"
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

          <p className="text-sm text-center text-pink-200 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default SignupPage;
