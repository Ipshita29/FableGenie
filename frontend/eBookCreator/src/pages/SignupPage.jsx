import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookOpen, UserPlus, User } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";

import Signup from "../assets/Signup.png";  

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
          <InputField
            type="text"
            name="name"
            placeholder="Full Name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <InputField
            type="email"
            name="email"
            placeholder="Email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            type="password"
            name="password"
            placeholder="Password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
          />

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
